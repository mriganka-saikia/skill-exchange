const express = require("express");
const { generateDescription } = require("../controller/ai.controller");
const { authCheck } = require("../middleware/auth");

const aiRouter = express.Router();
aiRouter.post("/generate-description", authCheck, generateDescription);

module.exports = { aiRouter };