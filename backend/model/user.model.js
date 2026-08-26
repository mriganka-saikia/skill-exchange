const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: {
            type: String,
            required: function () { return !this.googleId; },
        },
        phoneNumber: {
            type: Number,
            required: function () { return !this.googleId; },
        },
        googleId: { type: String, default: null },
        role: { type: [String], enum: ["helper", "seeker"], default: ["seeker"] },
        bio: { type: String, default: "" },
        location: { type: String, default: "" },
        avgRating: { type: Number, default: 0 },
        sessionsCompleted: { type: Number, default: 0 },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = { userModel: mongoose.model("user", userSchema) };