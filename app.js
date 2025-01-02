const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// MongoDB schema and model for messages
const messageSchema = new mongoose.Schema({
    eventId: String,
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// In-memory storage for events
const events = {};

// REST API endpoint to create events
app.post('/events', (req, res) => {
    try {
        const { eventName } = req.body;

        if (!eventName) {
            return res.status(400).json({ error: 'Event name is required.' });
        }

        const eventId = `event_${Date.now()}`;
        events[eventId] = { name: eventName, participants: [] };

        res.status(201).json({ eventId, eventName });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinEvent', async ({ eventId, username }) => {
        try {
            if (!events[eventId]) {
                socket.emit('error', 'Event does not exist.');
                return;
            }
            socket.join(eventId);
            events[eventId].participants.push({ id: socket.id, username });
            // Notify others in the room
            socket.to(eventId).emit('userJoined', `${username} has joined the event.`);
            console.log(`${username} joined event: ${eventId}`);
            // Send previous messages to the user
            const previousMessages = await Message.find({ eventId }).sort('timestamp');
            socket.emit('previousMessages', previousMessages);
        } catch (error) {
            console.error('Error in joinEvent:', error);
            socket.emit('error', 'An error occurred while joining the event.');
        }
    });

    socket.on('sendMessage', async ({ eventId, username, message }) => {
        try {
            if (!events[eventId]) {
                socket.emit('error', 'Event does not exist.');
                return;
            }

            // Save message to MongoDB
            const newMessage = new Message({ eventId, username, message });
            await newMessage.save();

            io.to(eventId).emit('message', { username, message });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'An error occurred while sending the message.');
        }
    });

    socket.on('disconnect', () => {
        try {
            for (const eventId in events) {
                const participantIndex = events[eventId].participants.findIndex(p => p.id === socket.id);
                if (participantIndex !== -1) {
                    const [leavingParticipant] = events[eventId].participants.splice(participantIndex, 1);
                    io.to(eventId).emit('userLeft', `${leavingParticipant.username} has left the event.`);
                    console.log(`${leavingParticipant.username} left event: ${eventId}`);
                }
            }

            console.log('A user disconnected:', socket.id);
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    });
});

// Serve the client
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('Error serving the client:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
