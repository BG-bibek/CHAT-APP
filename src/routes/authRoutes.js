const express = require("express");
const { login } = require("../controllers/authController");
const {validateLoginRequest} = require("../middlewares/validationMiddleware");
const router = express.Router();
const wrapNext = require('../middlewares/wrapNext');

/**
 * @route POST /api/auth/login
 * @desc Authenticate a user and return a JWT token
 * @access Public
 */
router.post("/login",validateLoginRequest, wrapNext(login));

module.exports = router;
