require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const { connectDB } = require("./config/db");
const { authRouter } = require("./routes/auth.route");
const { skillRouter } = require("./routes/skill.route");
const { bookingRouter } = require("./routes/booking.route");
const { adminRouter } = require("./routes/admin.route");
const { passport } = require("./config/passport");
const { aiRouter } = require("./routes/ai.route");
const { initSocket } = require("./config/socket");
const paymentRouter = require("./routes/payment.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 5 * 60 * 1000 },
    })
);
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/skills", skillRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/ai", aiRouter);
app.use("/api/payment", paymentRouter);

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});