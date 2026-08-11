import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DataBase Connected Successfully!")
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB disconnected");
        });

        mongoose.connection.on('reconnected', () => {
            console.log("MongoDB reconnected");
        });

        const connectionOptions = {
            dbName: process.env.DB_NAME || "wise-mind-os",
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 10000,
            retryWrites: true
        };

        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB;
