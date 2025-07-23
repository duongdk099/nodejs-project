const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // Provide specific error messages
    if (err.message.includes('ENOTFOUND')) {
      console.error('🌐 Network error: Check your internet connection');
    } else if (err.message.includes('authentication')) {
      console.error('🔐 Authentication error: Check your username/password');
    } else if (err.message.includes('timeout')) {
      console.error('⏰ Connection timeout: Check your IP whitelist in MongoDB Atlas');
    }
    
    throw err;
  }
}

module.exports = connectDB;
