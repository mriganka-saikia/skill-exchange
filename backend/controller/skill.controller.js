const { skillModel } = require("../model/skill.model");
const { reviewModel } = require("../model/review.model");

const getSkills = async (req, res) => {
    const { category, search, page = 1, limit = 9 } = req.query;

    const filter = { status: "approved", isActive: true };
    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
        ];
    }

    try {
        const skip = (Number(page) - 1) * Number(limit);

        const [skills, total] = await Promise.all([
            skillModel
                .find(filter)
                .populate("helper", "fullName avgRating sessionsCompleted location")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            skillModel.countDocuments(filter),
        ]);

        res.status(200).send({
            message: "Skills fetched successfully",
            skills,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const getMySkills = async (req, res) => {
    const { userId } = req.headers;
    try {
        const skills = await skillModel.find({ helper: userId }).sort({ createdAt: -1 });
        res.status(200).send({ message: "Your skill listings", skills });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const getSkillById = async (req, res) => {
    try {
        const skill = await skillModel
            .findById(req.params.id)
            .populate("helper", "fullName avgRating sessionsCompleted location bio");
        if (!skill) {
            return res.status(404).send({ message: "Skill listing not found" });
        }
        res.status(200).send({ message: "Skill fetched successfully", skill });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const createSkill = async (req, res) => {
    const { userId } = req.headers;
    const { title, description, category, tags, rateAmount, rateUnit, availability, images } = req.body;

    if (!title || !description || !category) {
        return res.status(400).send({ message: "Title, description and category are required" });
    }

    try {
        const skill = new skillModel({
            title,
            description,
            category,
            tags: Array.isArray(tags) ? tags : [],
            rateAmount,
            rateUnit,
            availability,
            images: Array.isArray(images) ? images : [],
            helper: userId,
            status: "pending",
        });
        await skill.save();

        res.status(201).send({ message: "Skill listing submitted for admin approval", skill });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const updateSkill = async (req, res) => {
    const { userId } = req.headers;
    const { title, description, category, tags, rateAmount, rateUnit, availability, images, isActive } = req.body;

    try {
        const skill = await skillModel.findById(req.params.id);
        if (!skill) {
            return res.status(404).send({ message: "Skill listing not found" });
        }
        if (String(skill.helper) !== String(userId)) {
            return res.status(403).send({ message: "You can only edit your own listings" });
        }

        if (title !== undefined) skill.title = title;
        if (description !== undefined) skill.description = description;
        if (category !== undefined) skill.category = category;
        if (tags !== undefined) skill.tags = tags;
        if (rateAmount !== undefined) skill.rateAmount = rateAmount;
        if (rateUnit !== undefined) skill.rateUnit = rateUnit;
        if (availability !== undefined) skill.availability = availability;
        if (images !== undefined) skill.images = images;
        if (isActive !== undefined) skill.isActive = isActive;

        
        skill.status = "pending";
        await skill.save();

        res.status(200).send({ message: "Skill listing updated and re-submitted for approval", skill });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const deleteSkill = async (req, res) => {
    const { userId } = req.headers;

    try {
        const skill = await skillModel.findById(req.params.id);
        if (!skill) {
            return res.status(404).send({ message: "Skill listing not found" });
        }
        if (String(skill.helper) !== String(userId) && !req.user?.isAdmin) {
            return res.status(403).send({ message: "You can only delete your own listings" });
        }

        await skill.deleteOne();
        res.status(200).send({ message: "Skill listing deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const getSkillReviews = async (req, res) => {
    try {
        const reviews = await reviewModel
            .find({ skill: req.params.id })
            .populate("reviewer", "fullName")
            .sort({ createdAt: -1 });
        res.status(200).send({ message: "Reviews fetched successfully", reviews });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getSkills,
    getMySkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillReviews,
};
