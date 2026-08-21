const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        helper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        rateAmount: {
            type: Number,
            default: 0,
        },
        rateUnit: {
            type: String,
            enum: ["free", "per-session", "per-hour", "swap"],
            default: "free",
        },
        availability: {
            type: String,
            default: "Flexible - contact to schedule",
        },
        images: {
            // simple image URLs (e.g. pasted links) - no upload service needed, stays in-syllabus
            type: [String],
            default: [],
        },
        // admin verification gate: listings only appear to seekers once approved
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const skillModel = mongoose.model("skill", skillSchema);

module.exports = {
    skillModel,
};
