const express = require("express");
const { authCheck } = require("../middleware/auth");
const { createOrder, verifyPayment } = require("../controller/payment.controller");

const router = express.Router();

router.post("/create-order", authCheck, createOrder);
router.post("/verify", authCheck, verifyPayment);

module.exports = router;