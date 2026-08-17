const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const { authRouter } = require("./routes/auth.route");
// ...

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ message: "Local Skill-Exchange Platform API is running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRouter);