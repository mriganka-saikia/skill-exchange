const express = require("express");
const {
    getSkills,
    getMySkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillReviews,
} = require("../controller/skill.controller");
const { createBooking } = require("../controller/booking.controller");
const { authCheck } = require("../middleware/auth");

const skillRouter = express.Router();

skillRouter.get("/", getSkills);
skillRouter.post("/", authCheck, createSkill);
skillRouter.get("/mine", authCheck, getMySkills);
skillRouter.get("/:id", getSkillById);
skillRouter.put("/:id", authCheck, updateSkill);
skillRouter.delete("/:id", authCheck, deleteSkill);
skillRouter.get("/:id/reviews", getSkillReviews);
skillRouter.post("/:id/book", authCheck, createBooking);

module.exports = {
    skillRouter,
};
