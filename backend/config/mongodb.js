import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectionOptions = {
      dbName: process.env.DB_NAME || 'wise-mind-os',
      bufferCommands: false,
    };

    mongoose.connection.on('connected', () => {
      console.log('Database Connected Successfully!');
    });

    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
