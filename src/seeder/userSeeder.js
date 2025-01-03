const mongoose = require('mongoose');
const User = require('../models/user');
const { DATABASE_URL } = require('../config/config');
const seedUsers = async () => {
  try {
    await mongoose.connect("DATABASE_URL", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    // const usersCount = await User.count({});
    // if (usersCount) return;
    const users = [
      { username: 'user123', password: 'password123' },
      { username: 'admin', password: 'adminpass' },
    ];
    const userCreationPromises = [];
    for (const userData of users) {
      const user = new User(userData);
      userCreationPromises.push(user.save());
    }
    await Promise.all(userCreationPromises)
    console.log('Users seeded!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();