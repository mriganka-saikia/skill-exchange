const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
        role: { type: [String], enum: ["helper", "seeker"], default: ["seeker"] },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = { userModel: mongoose.model("user", userSchema) };