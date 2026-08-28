const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const { skillModel } = require("../model/skill.model");
const { bookingModel } = require("../model/booking.model");
const { paymentModel } = require("../model/payment.model");
const { getIO } = require("../config/socket");

const PAID_RATE_UNITS = ["per-session", "per-hour"];

const createOrder = async (req, res) => {
  const userId = req.headers.userId;
  const { skillId, message, scheduledDate } = req.body;

  try {
    const skill = await skillModel.findById(skillId);
    if (!skill || skill.status !== "approved" || !skill.isActive) {
      return res.status(404).json({ success: false, message: "This skill listing is not available for booking" });
    }
    if (String(skill.helper) === String(userId)) {
      return res.status(400).json({ success: false, message: "You cannot book your own listing" });
    }
    if (!PAID_RATE_UNITS.includes(skill.rateUnit) || !skill.rateAmount) {
      return res.status(400).json({ success: false, message: "This listing isn't a paid skill" });
    }

    const amount = Math.round(skill.rateAmount * 100); // rupees -> paise, computed server-side

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `booking_${userId}_${Date.now()}`,
      notes: { userId: String(userId), skillId: String(skill._id) },
    });

    await paymentModel.create({
      user: userId,
      skill: skill._id,
      amount,
      razorpayOrderId: order.id,
      status: "created",
      bookingDraft: { message, scheduledDate },
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to create Razorpay order" });
  }
};

const verifyPayment = async (req, res) => {
  const userId = req.headers.userId;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const paymentRecord = await paymentModel.findOne({ razorpayOrderId: razorpay_order_id, user: userId });
    if (!paymentRecord) {
      return res.status(404).json({ success: false, message: "No matching order found for this user" });
    }
    if (paymentRecord.status === "paid") {
      return res.status(400).json({ success: false, message: "This order has already been processed" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      paymentRecord.status = "failed";
      await paymentRecord.save();
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const skill = await skillModel.findById(paymentRecord.skill);
    if (!skill) {
      return res.status(404).json({ success: false, message: "The skill for this order no longer exists" });
    }

    const booking = await bookingModel.create({
      skill: skill._id,
      seeker: userId,
      helper: skill.helper,
      message: paymentRecord.bookingDraft?.message || "",
      scheduledDate: paymentRecord.bookingDraft?.scheduledDate || undefined,
      status: "requested",
      paymentStatus: "paid",
      amountPaid: paymentRecord.amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    paymentRecord.status = "paid";
    paymentRecord.razorpayPaymentId = razorpay_payment_id;
    paymentRecord.booking = booking._id;
    await paymentRecord.save();

    getIO().to(String(skill.helper)).emit("booking:new", { bookingId: booking._id, skillTitle: skill.title });
    getIO().to(String(skill.helper)).emit("bookings:refresh");

    res.status(200).json({ success: true, message: "Payment verified, booking created", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };