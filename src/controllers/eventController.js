const Event = require('../models/event.js');

const createEvent = async (req, res) => {
    try {
        const { eventName } = req.body;
        const newEvent = new Event({ name : eventName });
        await newEvent.save();
        res.status(201).json({
            id: newEvent._id,
            EventName: newEvent.name
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createEvent };
