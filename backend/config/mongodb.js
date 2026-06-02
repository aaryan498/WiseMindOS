import mongoose from 'mongoose';

const connectDB = async()=> {
    mongoose.connection.on('connected', ()=>{
        console.log("DataBase Connected Successfully!")
    })
    const connectionOptions = {};
    connectionOptions.dbName = process.env.DB_NAME || "wise-mind-os";
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions)
}

export default connectDB;
