const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user.model");

const authCheck = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ message: "Unauthorized access" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized access" });
        const user = await userModel.findById(decoded.userId);
        if (!user) return res.status(401).send({ message: "Unauthorized access" });
        req.headers.userId = decoded.userId;
        req.user = user;
        next();
    });
};

module.exports = { authCheck };