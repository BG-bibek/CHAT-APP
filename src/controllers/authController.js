const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {JWT_SECRET} = require("../config/config");
const CustomError = require('../errors/custom-error');

// Controller for user login
const login = async (req, res) => {
    const { username, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
        throw new CustomError('Invalid username or password.', 401, 'fail');

    }
    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new CustomError('Invalid username or password.', 401, 'fail');
    }
    // Generate a JWT token
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" } // Token expiration time
    );
    res.status(200).json({ token });
};

module.exports = { login };
