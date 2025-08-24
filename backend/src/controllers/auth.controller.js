import { upsertStreamUser } from "../lib/stream.js";
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

        // Upsert user in Stream
        try {
            await upsertStreamUser({
                id:newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ''
            })
            console.log(`Stream user upserted successfully for user: ${newUser.fullName}`);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
        }


        const token = jwt.sign(
            {userId:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProd,             // HTTPS only in production
            sameSite: isProd ? 'none' : 'lax' // 'none' for cross-site cookies in production
        });

        res.status(201).json({success: true, user: newUser});

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const login = async (req,res)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: isProd,             // HTTPS only in production
            sameSite: isProd ? 'none' : 'lax' // 'none' for cross-site cookies in production
        });
        res.status(200).json({success: true, user});
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const logout = (req,res)=> {
    try {
        res.clearCookie('jwt');
        res.status(200).json({success: true, message: 'Logged out successfully'});
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const onboard = async (req,res)=>{
    try {
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage, learningLanguage,location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: 'Please fill all the fields...',
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean) // Filter out undefined values
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, {new: true});

        if(!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        // Upsert user in Stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ''
            });
            console.log(`Stream user upserted successfully for user: ${updatedUser.fullName}`);
            
        } catch (error) {
            console.error("Error upserting Stream user:", error);
        }
        

        res.status(200).json({success: true, user: updatedUser});

    } catch (error) {
        console.error("Error during onboard:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}