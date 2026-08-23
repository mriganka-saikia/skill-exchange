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
    },
    { timestamps: true }
);

module.exports = { bookingModel: mongoose.model("booking", bookingSchema) };