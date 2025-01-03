const express = require('express');
const path = require('path');
const eventRoutes = require('../routes/eventRoutes');
const authRoutes = require('../routes/authRoutes');
const setupSwagger = require('../swagger');

const createServer = () => {
    const app = express();
    setupSwagger(app);

    // Middleware to parse JSON requests
    app.use(express.json());
    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, '../../public')));
    // Event routes
    app.use('/api/events', eventRoutes);
    app.use('/api/auth/login', authRoutes)
    // Serve the main HTML file for the root URL
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    });

    return app;
};

module.exports = createServer;
