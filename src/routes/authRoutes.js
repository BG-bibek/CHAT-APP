const express = require("express");
const { login } = require("../controllers/authController");
const {validateLoginRequest} = require("../middlewares/validationMiddleware");
const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate a user and return a JWT token
 * @access Public
 */
router.post("/",validateLoginRequest, login);

module.exports = router;
