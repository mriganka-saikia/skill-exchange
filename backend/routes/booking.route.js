const express = require("express");
const {
    getMyBookings,
    getIncomingBookings,
    getBookingById,
    updateBooking,
    updateBookingStatus,
} = require("../controller/booking.controller");
const { createReview } = require("../controller/review.controller");
const { authCheck } = require("../middleware/auth");

const bookingRouter = express.Router();

bookingRouter.get("/mine", authCheck, getMyBookings);
bookingRouter.get("/incoming", authCheck, getIncomingBookings);
bookingRouter.get("/:id", authCheck, getBookingById);
bookingRouter.put("/:id", authCheck, updateBooking);
bookingRouter.put("/:id/status", authCheck, updateBookingStatus);
bookingRouter.post("/:id/review", authCheck, createReview);

module.exports = {
    bookingRouter,
};
