const { PORT } = require('./src/config/config');
const connectToDatabase = require('./src/database/connection');
const createServer = require('./src/loaders/server');
const configureSocket = require('./src/loaders/socket');

(async () => {
    try {
        await connectToDatabase(); // Connect to the database
        const app = createServer(); // Create Express app
        const httpServer = configureSocket(app); // Configure and get the HTTP server with Socket.io
        // Start the HTTP server
        httpServer.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();
