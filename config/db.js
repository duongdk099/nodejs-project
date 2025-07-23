const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Make sure your IP is whitelisted in MongoDB Atlas or use a local MongoDB instance');
    process.exit(1);
  }
}

module.exports = connectDB;
