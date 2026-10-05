import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please check your .env file.');
    }

    // Connect using the URI from .env and ensure target database name
    const conn = await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'marketing_expense_tracker',
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};
