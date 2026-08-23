const express = require("express");
const { getMyBookings, getIncomingBookings, getBookingById } = require("../controller/booking.controller");
const { authCheck } = require("../middleware/auth");
const bookingRouter = express.Router();
const {
  updateBooking,
  updateBookingStatus
} = require("../controller/booking.controller");

const { createReview } = require("../controller/review.controller");
const { getMessages, sendMessage } = require("../controller/message.controller");

bookingRouter.put("/:id", authCheck, updateBooking);
bookingRouter.put("/:id/status", authCheck, updateBookingStatus);
bookingRouter.post("/:id/review", authCheck, createReview);
bookingRouter.get("/:id/messages", authCheck, getMessages);
bookingRouter.post("/:id/messages", authCheck, sendMessage);
bookingRouter.get("/mine", authCheck, getMyBookings);
bookingRouter.get("/incoming", authCheck, getIncomingBookings);
bookingRouter.get("/:id", authCheck, getBookingById);

module.exports = { bookingRouter };