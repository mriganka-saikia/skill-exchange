const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking", required: true, unique: true },
        skill: { type: mongoose.Schema.Types.ObjectId, ref: "skill", required: true },
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        helper: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = { reviewModel: mongoose.model("review", reviewSchema) };
