const http = require('http');
const { Server } = require('socket.io');
const Event = require('../models/event');

module.exports = (app) => {
    // Create HTTP server and initialize Socket.io
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins; adjust based on your requirements
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        // Handle user joining an event
        socket.on('joinEvent', async ({ eventName, username }) => {
            try {
                // Find the event by name
                const event = await Event.findOne({ name: eventName });
                if (!event) {
                    socket.emit('error', 'Event does not exist.');
                    return;
                }
                socket.join(event._id.toString()); // Use the event's ID as the room name
                // Add participant to the event's participant list
                event.participants.push({ id: socket.id, username });
                await event.save();
                // Notify other participants about the new user
                io.to(event._id.toString()).emit('userJoined', `${username} has joined the event.`);
                // Send previous messages to the joining user
                socket.emit('previousMessages', event.messages);
            } catch (error) {
                console.error('Error joining event:', error);
                socket.emit('error', 'An error occurred.');
            }
        });
        
        // Handle sending messages in an event
        socket.on('sendMessage', async ({ eventName, username, message }) => {
            try {
                // Find the event by name
                const event = await Event.findOne({ name: eventName });
                if (!event) {
                    socket.emit('error', 'Event does not exist.');
                    return;
                }
                const newMessage = { username, message, timestamp: new Date() };
                // Add the new message to the event's messages array
                event.messages.push(newMessage);
                await event.save();
                // Broadcast the message to all participants in the event
                io.to(event._id.toString()).emit('message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', 'An error occurred.');
            }
        });

        // Handle user disconnection
        socket.on('disconnect', async () => {
            try {
                const events = await Event.find();
                for (const event of events) {
                    const participantIndex = event.participants.findIndex(p => p.id === socket.id);
                    if (participantIndex !== -1) {
                        const [leavingParticipant] = event.participants.splice(participantIndex, 1);
                        await event.save();

                        // Notify remaining participants that the user has left
                        io.to(event._id.toString()).emit('userLeft', `${leavingParticipant.username} has left the event.`);
                        break;
                    }
                }
                console.log('A user disconnected:', socket.id);
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });

    return httpServer; // Return the HTTP server for app.js to start listening
};
