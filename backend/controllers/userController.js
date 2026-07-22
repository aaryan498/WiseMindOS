import userModel from "../models/userModel.js";
import imagekit from "../config/imagekit.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { OAuth2Client } from 'google-auth-library';
import { sanitizeField } from '../utils/sanitize.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



// Route for user Login 
const loginUser = async (req, res, next) => {

    try {

        const { identifier, password } = req.body;

        // Reject non-string inputs to prevent MongoDB operator injection
        if (typeof identifier !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid input.' });
        }

        const user = await userModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });

        if (!user) {
            return res.json({ success: false, message: "User not found. Please Register first." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            return res.json({ success: true, message: "Login Successful", token, name: user.name, email: user.email, username: user.username, bio: user.bio, profile_picture: user.profile_picture })
        }
        else {
            return res.json({ success: false, message: "Invalid Credentials" })
        }


    } catch (error) {
        next(error);
    }

}

//Route for Google SignIn
const googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;

        // Check if credential is provided
        if (!credential) {
            return res.json({ success: false, message: "Google token credential is required." });
        }

        // Verify the token and get user information
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Extract user information from the token
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId, email_verified } = payload;

        if (!email_verified) {
            return res.status(400).json({
                success: false,
                message: "Access denied. Your Google email address is not verified.",
            });
        }
        
        let user = await userModel.findOne({ googleId });

        if (!user) {
            const existingEmailUser = await userModel.findOne({ email });

            if (existingEmailUser) {
                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists. Please log in using your email and password."
                });
            }
            
            const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
            let generatedUsername = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
            
            let isUnique = false;
            let iterations = 0;
            const MAX_ITERATIONS = 5; 

            while (!isUnique && iterations < MAX_ITERATIONS) {
                const checkUsernameConflict = await userModel.findOne({ username: generatedUsername });
                
                if (!checkUsernameConflict) {
                    isUnique = true; 
                } else {
                    iterations++;
                    if (iterations >= 3) {
                        const randomString = Math.random().toString(36).substring(2, 7); 
                        generatedUsername = `${baseUsername}${randomString}`;
                    } else {
                        generatedUsername = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
                    }
                }
            }

            //Timestamp fallback if uniqueness is not achieved after max iterations (extremely unlikely)
            if (!isUnique) {
                generatedUsername = `${baseUsername}${Date.now().toString().slice(-5)}`;
            }

            user = await userModel.create({
                name: name || baseUsername,
                username: generatedUsername,
                email,
                googleId,
                profile_picture: picture || ''
            });
        }
        

        // create a JWT token for the user
        const token = createToken(user._id);

        // Send the token and user info back to the client
        return res.json({
            success: true,
            message: "Login Successful",
            token,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profile_picture: user.profile_picture
        });
    } catch (error) {
        next(error);
    }
}

// Route for User register
const registerUser = async (req, res, next) => {

    try {

       const { name, email, password, username } = req.body;
        // Reject non-string inputs to prevent MongoDB operator injection
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof username !== 'string'
        ) {
            return res.status(400).json({ success: false, message: 'Invalid input.' });
        }
        const { value: cleanName, error: nameError } = sanitizeField(name, 'name', { required: true });
        if (nameError) return res.status(400).json({ success: false, message: nameError });
        const { value: cleanUsername, error: usernameError } = sanitizeField(username, 'username', { required: true });
        if (usernameError) return res.status(400).json({ success: false, message: usernameError });

        // Checking if there is the user exists in database with the same email.
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already Exists." })
        }

        const existsUsername = await userModel.findOne({ username });
        if (existsUsername) {
            return res.json({ success: false, message: "Username already taken. Try another !" })
        }


        // Validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email." })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must at least contain 8 characters." })
        }


        // Hashing User's password
        const salt = await bcrypt.genSalt(9)          // The higher the number the more time it will take to hash users password.
        const hashedPassword = await bcrypt.hash(password, salt)


        // Creating new User in database.
        const newUser = new userModel({
            name: cleanName,
            username: cleanUsername,
            email,
            password: hashedPassword
        })
        // Saving the new user in database.
        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token, bio: user.bio,  message: 'Account Created Successfully!' })


    } catch (error) {
        next(error);
    }

}

const updateUser = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { name, username, bio } = req.body;

        // Find current user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let isModified = false;

        // If username is being changed → check uniqueness
        if (username && username !== user.username) {
            const existingUsername = await userModel.findOne({
                username,
                _id: { $ne: userId }
            });
            if (existingUsername) {
                return res.json({
                    success: false,
                    message: "Username already taken. Try another!"
                });
            }
        }

        // Update only allowed fields
        if (name && name !== user.name) {
            const { value: cleanName, error: nameError } = sanitizeField(name, 'name', { required: true });
            if (nameError) return res.status(400).json({ success: false, message: nameError });
            user.name = cleanName;
            isModified = true;
        }
        if (username && username !== user.username) {
            const { value: cleanUsername, error: usernameError } = sanitizeField(username, 'username', { required: true });
            if (usernameError) return res.status(400).json({ success: false, message: usernameError });
            user.username = cleanUsername;
            isModified = true;
        }
        if (bio !== undefined && bio !== user.bio) {
            const { value: cleanBio, error: bioError } = sanitizeField(bio, 'bio');
            if (bioError) return res.status(400).json({ success: false, message: bioError });
            user.bio = cleanBio;
            isModified = true;
        }


        if (!isModified) {
            return res.json({ success: true, message: "No changes made" });
        }

        // Save updated user
        const updatedUser = await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                username: updatedUser.username,
                bio: updatedUser.bio,
                email: updatedUser.email,
            }
        });

    } catch (error) {
        next(error);
    }
};


const updateUserProfilePic = async (req, res, next) => {
    try {

        const userId = req.user.id;

        // Find current user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let isModified = false;


        if (!req.files || !req.files.profile || !req.files.profile[0]) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const profile = req.files.profile[0];
        // const cover = req.files.cover && req.files.cover[0];

        if(profile){
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
            if (!allowedTypes.includes(profile.mimetype)) {
                if (fs.existsSync(profile.path)) {
                    fs.unlinkSync(profile.path);
                }
                return res.json({ success: false, message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." });
            }

            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width: '512'}
                ]
            })
            user.profile_picture = url;
            isModified = true;
        }
        
        // if(cover){
        //     const buffer = fs.readFileSync(cover.path)
        //     const response = await imagekit.upload({
        //         file: buffer,
        //         fileName: cover.originalname,
        //     })

        //     const url = imagekit.url({
        //         path: response.filePath,
        //         transformation: [
        //             {quality: 'auto'},
        //             {format: 'webp'},
        //             {width: '1280'}
        //         ]
        //     })
        //     user.cover_photo = url;
        //     isModified = true;
        // }


        if (!isModified) {
            return res.json({ success: true, message: "No changes made" });
        }

        // Save updated user
        const updatedUser = await user.save();

        res.json({
            success: true,
            message: "Profile Picture updated successfully",
            user: {
                profile_picture: updatedUser.profile_picture,
            }
        });

    } catch (error) {
        next(error);
    }
};




export { loginUser, googleLogin, registerUser, updateUser, updateUserProfilePic }