const request = require('supertest');
const http = require('http');
const app = require('../src/loaders/server'); // Path to your server or app instance
const Event = require('../src/models/event');

// Wrap the app in an HTTP server
const server = http.createServer(app);

describe('POST /api/events', () => {
    beforeAll(async () => {
        // Setup test database or mock it
        await Event.deleteMany({});
    });

    afterAll(async () => {
        await Event.deleteMany({});
        server.close(); // Close the server after tests
    });

    it('should create an event successfully', async () => {
        const response = await request(server)
            .post('/api/events')
            .send({ eventName: 'TestEvent' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('eventId');
    });

    it('should return 400 for an event name that already exists', async () => {
        // Seed an event
        await Event.create({ name: 'DuplicateEvent' });

        const response = await request(server)
            .post('/api/events')
            .send({ eventName: 'DuplicateEvent' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Event name already exists');
    });
});
