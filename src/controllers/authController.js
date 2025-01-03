const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {JWT_SECRET} = require("../config/config");

// Controller for user login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }
        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }
        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expiration time
        );
        res.status(200).json({ token });
        
    } catch (error) {
        res.status(500).json({ message: "Failed to log in.", error: error.message });
    }
};

module.exports = { login };
