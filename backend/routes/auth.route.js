const jwt = require("jsonwebtoken");
const { passport } = require("../config/passport");
const express = require("express");
const { register, login, getProfile, updateProfile } = require("../controller/auth.controller");
const { authCheck } = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authCheck, getProfile);
authRouter.put("/profile", authCheck, updateProfile);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    }
);

module.exports = { authRouter };