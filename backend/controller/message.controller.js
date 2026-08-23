const { messageModel } = require("../model/message.model");
const { bookingModel } = require("../model/booking.model");
const { getIO } = require("../config/socket");

const getMessages = async (req, res) => {
    const { userId } = req.headers;
    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) return res.status(404).send({ message: "Booking not found" });

        const isParticipant = String(booking.seeker) === String(userId) || String(booking.helper) === String(userId);
        if (!isParticipant) return res.status(403).send({ message: "You do not have access to this conversation" });

        const messages = await messageModel.find({ booking: booking._id }).sort({ createdAt: 1 });
        res.status(200).send({ message: "Messages fetched", messages });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const sendMessage = async (req, res) => {
    const { userId } = req.headers;
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).send({ message: "Message cannot be empty" });

    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) return res.status(404).send({ message: "Booking not found" });

        const isSeeker = String(booking.seeker) === String(userId);
        const isHelper = String(booking.helper) === String(userId);
        if (!isSeeker && !isHelper) return res.status(403).send({ message: "You do not have access to this conversation" });

        const receiver = isSeeker ? booking.helper : booking.seeker;

        const newMessage = await messageModel.create({
            booking: booking._id,
            sender: userId,
            receiver,
            content: content.trim(),
        });

        getIO().to(String(receiver)).emit("chat:message", newMessage);
        getIO().to(String(userId)).emit("chat:message", newMessage);

        res.status(201).send({ message: "Message sent", newMessage });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = { getMessages, sendMessage };