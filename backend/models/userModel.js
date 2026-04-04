import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    
}, { minimize: false })

// In MongoDb database, it does not create a coloumn for cartData if it sees it that it get initialised as empty object by default. So to avoid this we have added minimize: false.

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel;
