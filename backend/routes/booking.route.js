const express = require("express");
const {
    getMyBookings,
    getIncomingBookings,
    getBookingById,
    updateBooking,
    updateBookingStatus,
} = require("../controller/booking.controller");
const { createReview } = require("../controller/review.controller");
const { getMessages, sendMessage } = require("../controller/message.controller");
const { authCheck } = require("../middleware/auth");

const bookingRouter = express.Router();

// specific literal routes first
bookingRouter.get("/mine", authCheck, getMyBookings);
bookingRouter.get("/incoming", authCheck, getIncomingBookings);

// then param routes, most specific pattern first
bookingRouter.get("/:id/messages", authCheck, getMessages);
bookingRouter.post("/:id/messages", authCheck, sendMessage);
bookingRouter.put("/:id/status", authCheck, updateBookingStatus);
bookingRouter.post("/:id/review", authCheck, createReview);
bookingRouter.put("/:id", authCheck, updateBooking);
bookingRouter.get("/:id", authCheck, getBookingById);

module.exports = { bookingRouter };