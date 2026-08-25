require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const run = async () => {
    const plan = await razorpay.plans.create({
        period: "monthly",
        interval: 1,
        item: {
            name: "Swap Premium — Verified Helper",
            amount: 19900, // ₹199.00 — amount is always in paise
            currency: "INR",
        },
    });
    console.log("Plan created. Add this to backend/.env:");
    console.log(`RAZORPAY_PLAN_ID=${plan.id}`);
};

run();