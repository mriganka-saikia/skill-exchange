const { bookingModel } = require("../model/booking.model");
const { skillModel } = require("../model/skill.model");

// POST /api/skills/:id/book - seeker books a helper's skill
const createBooking = async (req, res) => {
    const { userId } = req.headers;
    const { message, scheduledDate } = req.body;

    try {
        const skill = await skillModel.findById(req.params.id);
        if (!skill || skill.status !== "approved" || !skill.isActive) {
            return res.status(404).send({ message: "This skill listing is not available for booking" });
        }
        if (String(skill.helper) === String(userId)) {
            return res.status(400).send({ message: "You cannot book your own listing" });
        }

        const booking = new bookingModel({
            skill: skill._id,
            seeker: userId,
            helper: skill.helper,
            message,
            scheduledDate,
            status: "requested",
        });
        await booking.save();

        res.status(201).send({ message: "Booking request sent", booking });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// GET /api/bookings/mine - bookings I made as a seeker
const getMyBookings = async (req, res) => {
    const { userId } = req.headers;
    try {
        const bookings = await bookingModel
            .find({ seeker: userId })
            .populate("skill", "title category")
            .populate("helper", "fullName")
            .sort({ createdAt: -1 });
        res.status(200).send({ message: "Your bookings", bookings });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// GET /api/bookings/incoming - booking requests I receive as a helper
const getIncomingBookings = async (req, res) => {
    const { userId } = req.headers;
    try {
        const bookings = await bookingModel
            .find({ helper: userId })
            .populate("skill", "title category")
            .populate("seeker", "fullName")
            .sort({ createdAt: -1 });
        res.status(200).send({ message: "Incoming requests", bookings });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
    const { userId } = req.headers;
    try {
        const booking = await bookingModel
            .findById(req.params.id)
            .populate("skill")
            .populate("seeker", "fullName phoneNumber")
            .populate("helper", "fullName phoneNumber");

        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        const isParticipant =
            String(booking.seeker._id) === String(userId) || String(booking.helper._id) === String(userId);
        if (!isParticipant) {
            return res.status(403).send({ message: "You do not have access to this booking" });
        }

        res.status(200).send({ message: "Booking fetched successfully", booking });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

// PUT /api/bookings/:id - general edit (message / scheduledDate), seeker only, before the helper responds
const updateBooking = async (req, res) => {
    const { userId } = req.headers;
    const { message, scheduledDate } = req.body;

    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        if (String(booking.seeker) !== String(userId)) {
            return res.status(403).send({ message: "Only the seeker who made this booking can edit it" });
        }
        if (booking.status !== "requested") {
            return res.status(400).send({ message: "This booking can no longer be edited" });
        }

        if (message !== undefined) booking.message = message;
        if (scheduledDate !== undefined) booking.scheduledDate = scheduledDate;
        await booking.save();

        res.status(200).send({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const ALLOWED_TRANSITIONS = {
    // who is allowed to move a booking from one status to the next
    requested: { accepted: "helper", declined: "helper", cancelled: "seeker" },
    accepted: { completed: "helper", cancelled: "seeker" },
};

// PUT /api/bookings/:id - status transitions, enforced both by role and by current status
const updateBookingStatus = async (req, res) => {
    const { userId } = req.headers;
    const { status } = req.body;

    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }

        const rule = ALLOWED_TRANSITIONS[booking.status]?.[status];
        if (!rule) {
            return res.status(400).send({ message: `Cannot move booking from '${booking.status}' to '${status}'` });
        }

        const isHelper = String(booking.helper) === String(userId);
        const isSeeker = String(booking.seeker) === String(userId);
        if ((rule === "helper" && !isHelper) || (rule === "seeker" && !isSeeker)) {
            return res.status(403).send({ message: "You are not allowed to make this change" });
        }

        booking.status = status;
        await booking.save();

        // bump the helper's session count once a booking is genuinely completed
        if (status === "completed") {
            const { userModel } = require("../model/user.model");
            await userModel.findByIdAndUpdate(booking.helper, { $inc: { sessionsCompleted: 1 } });
        }

        res.status(200).send({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getIncomingBookings,
    getBookingById,
    updateBooking,
    updateBookingStatus,
};
