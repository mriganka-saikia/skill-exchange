const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        skill: { type: mongoose.Schema.Types.ObjectId, ref: "skill", required: true },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking", default: null },
        amount: { type: Number, required: true }, // paise
        currency: { type: String, default: "INR" },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String },
        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
        bookingDraft: {
            message: String,
            scheduledDate: Date,
        },
    },
    { timestamps: true }
);

module.exports = { paymentModel: mongoose.model("payment", paymentSchema) };