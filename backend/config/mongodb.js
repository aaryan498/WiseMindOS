import mongoose from 'mongoose';

const connectDB = async()=> {
    mongoose.connection.on('connected', ()=>{
        console.log("DataBase Connected Successfully!")
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/wise-mind-os`)
}

export default connectDB;