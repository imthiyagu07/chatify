import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) return res.status(401).json({ message: "unauthorized - No token provided"});

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) return res.status(401).json({ message: "unauthorized - Invalid token"});

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) return res.status(404).json({ message: "User not found"});

        req.user = user;
        next();

    } catch (err) {
        console.log("Error in protectRoute middleware:", err);
        res.status(500).json({ message: "Internal server error"});
    }
}