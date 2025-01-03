const express = require('express');
const { createEvent } = require('../controllers/eventController');
const { authenticate } = require("../middlewares/authMiddleware");
const { validateCreateEvent } = require("../middlewares/validationEvent");
const wrapNext = require('../middlewares/wrapNext');

const router = express.Router();
router.post('/',authenticate,validateCreateEvent, wrapNext(createEvent));

module.exports = router;
