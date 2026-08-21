const { reviewModel } = require("../model/review.model");
const { bookingModel } = require("../model/booking.model"); // B's Day 5 model
const { userModel } = require("../model/user.model");

const createReview = async (req, res) => {
    const { userId } = req.headers;
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).send({ message: "Rating must be between 1 and 5" });
    }
    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) return res.status(404).send({ message: "Booking not found" });
        if (String(booking.seeker) !== String(userId)) {
            return res.status(403).send({ message: "Only the seeker can review this booking" });
        }
        if (booking.status !== "completed") {
            return res.status(400).send({ message: "You can only review a completed booking" });
        }
        const existing = await reviewModel.findOne({ booking: booking._id });
        if (existing) return res.status(400).send({ message: "This booking has already been reviewed" });

        const review = new reviewModel({ booking: booking._id, skill: booking.skill, reviewer: userId, helper: booking.helper, rating, comment });
        await review.save();

        const helperReviews = await reviewModel.find({ helper: booking.helper });
        const avg = helperReviews.reduce((sum, r) => sum + r.rating, 0) / helperReviews.length;
        await userModel.findByIdAndUpdate(booking.helper, { avgRating: Math.round(avg * 10) / 10 });

        res.status(201).send({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = { createReview };