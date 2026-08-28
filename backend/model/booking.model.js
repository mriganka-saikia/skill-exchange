const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        skill: { type: mongoose.Schema.Types.ObjectId, ref: "skill", required: true },
        seeker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        helper: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        message: { type: String, default: "" },
        scheduledDate: { type: Date },
               status: {
            type: String,
            enum: ["requested", "accepted", "declined", "completed", "cancelled"],
            default: "requested",
        },
        paymentStatus: {
            type: String,
            enum: ["not_required", "paid", "refunded", "failed"],
            default: "not_required",
        },
        amountPaid: { type: Number, default: 0 }, // paise
        razorpayOrderId: { type: String, default: null },
        razorpayPaymentId: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = { bookingModel: mongoose.model("booking", bookingSchema) };