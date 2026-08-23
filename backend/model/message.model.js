const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking", required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        content: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

module.exports = { messageModel: mongoose.model("message", messageSchema) };