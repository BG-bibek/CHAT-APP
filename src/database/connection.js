const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config/config');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectToDatabase;
