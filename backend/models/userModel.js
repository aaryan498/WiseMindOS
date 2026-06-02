import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    profile_picture: {type: String, default: ''},
    // cover_photo: {type: String, default: ''},
    name: { type: String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId } },
    googleId: { type: String, unique: true, sparse: true },
    bio: { type: String, default: 'Boosting Myself...Kicking off the limits' },
    
    
}, { minimize: false, timestamps: true })

// In MongoDb database, it does not create a coloumn for cartData if it sees it that it get initialised as empty object by default. So to avoid this we have added minimize: false.

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel;
