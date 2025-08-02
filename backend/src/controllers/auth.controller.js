import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res)=> {
    const {email,password, fullName} = req.body;

    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }
        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists pls try another one" });
        }

        const idx = Math.floor(Math.random()*100)+1; // Random index for profile picture bwt 1 and 100 (inclusive)
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        })

        // TODO: create a stream user

        const token = jwt.sign(
            {userId:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.cookie('jwt',token,{
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,// Prevents client-side JavaScript from accessing the cookie
            sameSite : 'strict', // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === 'production' // Ensures the cookie is sent over HTTPS in production
        })

        res.status(201).json({success: true, user: newUser});

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const login = async (req,res)=> {
    res.send('Login Route')
}

export const logout = (req,res)=> {
    res.send('Logout Route')
}