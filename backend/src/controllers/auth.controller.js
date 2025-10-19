import bcrypt from "bcrypt"

import User from "../models/User.model.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const {username, email, password} = req.body
    try {
        if (!username.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        // check if email is vaild
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email, 
            password: hashedPassword,
        })

        if (newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)

            res.status(201).json({
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                profilepic: savedUser.profilePic
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.username, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({email})
        if (!user) return res.status(400).json({message: "Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (err) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({ message: "Logged out successfully"});
}

export const updateProfile = async (req, res) => {
    const {profilePic} = req.body;
    try {
        if (!profilePic) return res.status(400).json({message: "Profile pic is required"})
        
        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true}).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({message: "Internal server error"});
    }
}