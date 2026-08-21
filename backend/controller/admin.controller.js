const { userModel } = require("../model/user.model");
const { skillModel } = require("../model/skill.model");
const { bookingModel } = require("../model/booking.model");

const getAllUsers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const users = await userModel.find().select("-password").skip(skip).limit(limit);
        const totalUsers = await userModel.countDocuments();
        res.status(200).send({ message: "Users fetched successfully", users, totalUsers, totalPages: Math.ceil(totalUsers / limit), currentPage: page });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const getPendingSkills = async (req, res) => {
    try {
        const skills = await skillModel.find({ status: "pending" }).populate("helper", "fullName email").sort({ createdAt: 1 });
        res.status(200).send({ message: "Pending skill listings", skills });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const verifySkill = async (req, res) => {
    const { decision } = req.body;
    if (!["approved", "rejected"].includes(decision)) {
        return res.status(400).send({ message: "Decision must be 'approved' or 'rejected'" });
    }
    try {
        const skill = await skillModel.findById(req.params.id);
        if (!skill) return res.status(404).send({ message: "Skill listing not found" });
        skill.status = decision;
        await skill.save();
        res.status(200).send({ message: `Skill listing ${decision}`, skill });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const [totalUsers, skillsByStatus, bookingsByStatus, skillsByCategory] = await Promise.all([
            userModel.countDocuments(),
            skillModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            bookingModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            skillModel.aggregate([{ $match: { status: "approved" } }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
        ]);
        res.status(200).send({ message: "Reports fetched successfully", totalUsers, skillsByStatus, bookingsByStatus, skillsByCategory });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = { getAllUsers, getPendingSkills, verifySkill, getReports };