import User from "../models/User.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt"

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
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    res.send("Login endpoint");
}

export const logout = async (req, res) => {
    res.send("Logout endpoint");
}