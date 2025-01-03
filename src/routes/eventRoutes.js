const express = require('express');
const { createEvent } = require('../controllers/eventController');
const { authenticate } = require("../middlewares/authMiddleware");
const { validateCreateEvent } = require("../middlewares/validationEvent");

const router = express.Router();
router.post('/',authenticate,validateCreateEvent, createEvent);

module.exports = router;
