const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/config");
const CustomError = require('../errors/custom-error');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) {
        throw new CustomError('Unauthorized', 401, 'fail');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        throw new CustomError('Invalid or expired token', 401, 'fail');

    }
};

module.exports = { authenticate };
