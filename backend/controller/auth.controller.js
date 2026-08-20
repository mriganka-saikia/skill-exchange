const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { fullName, email, password, phoneNumber, role } = req.body;
    if (!fullName || !email || !password || !phoneNumber) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const existUser = await userModel.findOne({ email });
        if (existUser) return res.status(400).send({ message: "User already exists" });

        const hash = await bcrypt.hash(password, 5);
        const user = new userModel({ fullName, email, password: hash, phoneNumber, role });
        await user.save();

        res.status(200).send({ message: "Registration is completed" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existUser = await userModel.findOne({ email });
        if (!existUser) return res.status(400).send({ message: "User not found" });

        const match = await bcrypt.compare(password, existUser.password);
        if (!match) return res.status(400).send({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
        res.status(200).send({ message: "Login is successful", user: existUser, token });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = { register, login };

const getProfile = async (req, res) => {
    const { userId } = req.headers;
    try {
        const user = await userModel.findById(userId).select("-password");
        if (!user) return res.status(404).send({ message: "User not found" });
        res.status(200).send({ message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.headers;
    const { fullName, phoneNumber, bio, location, role } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send({ message: "User not found" });

        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (Array.isArray(role) && role.length) user.role = role;

        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        res.status(200).send({ message: "Profile updated successfully", user: safeUser });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = { register, login, getProfile, updateProfile };
