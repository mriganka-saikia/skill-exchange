const razorpay = require("../config/razorpay");

const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 10000, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
};

module.exports = {
  createOrder,
};