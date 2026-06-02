import mongoose from 'mongoose';

const connectDB = async()=> {
    mongoose.connection.on('connected', ()=>{
        console.log("DataBase Connected Successfully!")
    })
    const connectionOptions = {};
    connectionOptions.dbName = process.env.DB_NAME || "wise-mind-os";
    const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!dbUri) {
        throw new Error("Database URI is not defined. Please set MONGODB_URI or MONGO_URI in your environment variables.");
    }
    await mongoose.connect(dbUri, connectionOptions)
}

export default connectDB;
