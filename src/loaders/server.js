const express = require('express');
const path = require('path');
const eventRoutes = require('../routes/eventRoutes');
const authRoutes = require('../routes/authRoutes');
const setupSwagger = require('../swagger');
const globalErrorHandler = require('../middlewares/errorHandler');
const CustomError = require('../errors/custom-error');

const createServer = () => {
    const app = express();
    setupSwagger(app);

    // Middleware to parse JSON requests
    app.use(express.json());
    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, '../../public')));
    // Event routes
    app.use('/api/events', eventRoutes);
    app.use('/api/auth', authRoutes);
   
    // Global error-handling middleware
    app.use(globalErrorHandler);    
    // Serve the main HTML file for the root URL
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
    app.all('*', (req, res, next) => {
        const err = new CustomError(`Can't find ${req.originalUrl} on this server`, 404, 'fail');
        next(err); // Forward to the error handler
      });
    return app;
};

module.exports = createServer;
