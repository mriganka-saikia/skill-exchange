const express = require("express");
const { getAllUsers, getPendingSkills, verifySkill, getReports } = require("../controller/admin.controller");
const { authCheck } = require("../middleware/auth");
const { adminCheck } = require("../middleware/admin");
const adminRouter = express.Router();

adminRouter.get("/users", authCheck, adminCheck, getAllUsers);
adminRouter.get("/skills/pending", authCheck, adminCheck, getPendingSkills);
adminRouter.put("/skills/:id/verify", authCheck, adminCheck, verifySkill);
adminRouter.get("/reports", authCheck, adminCheck, getReports);

module.exports = { adminRouter };