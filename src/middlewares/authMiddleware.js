const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/config");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { authenticate };
