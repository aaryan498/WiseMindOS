import userModel from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'




const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}



// Route for user Login 
const loginUser = async(req, res)=>{

    try {
        
        const { email, password } = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({ success: false, message: "User not found. Please Register first." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id)
            return res.json({success: true, token})
        }
        else{
            return res.json({success: false, message: "Invalid Credentials"})
        }


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
    
}

// Route for User register
const registerUser = async(req, res)=>{

    try {
        
        const { name, email, password } = req.body;
    
        // Checking if there is the user exists in database with the same email.
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({ success: false, message: "User already Exists." })
        }
    
    
        // Validating email format and strong password
        if (!validator.isEmail(email)){
            return res.json({ success: false, message: "Please enter a valid email." })
        }
        if (password.length < 8){
            return res.json({ success: false, message: "Password must at least contain 8 characters." })
        }
    
    
        // Hashing User's password
        const salt = await bcrypt.genSalt(9)          // The higher the number the more time it will take to hash users password.
        const hashedPassword = await bcrypt.hash(password, salt)


        // Creating new User in database.
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        // Saving the new user in database.
        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success: true, token})


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }

}

export { loginUser, registerUser }