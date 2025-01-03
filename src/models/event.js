const mongoose = require('mongoose');
const messageSchema = require('./message.js');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    participants: [{ id: String, username: String }],
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
