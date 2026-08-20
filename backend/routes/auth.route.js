const express = require("express");
const { register, login, getProfile, updateProfile } = require("../controller/auth.controller");
const { authCheck } = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authCheck, getProfile);
authRouter.put("/profile", authCheck, updateProfile);

module.exports = { authRouter };