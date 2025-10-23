import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getAllContacts:", err.message);
        res.status(500).json({ message: "Server error"});
    }
}

export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id} = req.params;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: id},
                {senderId: id, receiverId: myId},
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({senderId, receiverId, text, image: imageUrl});

        await newMessage.save();

        // todo: send message in real-time if user is online - socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const messages = await Message.find({ $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] });

        const chatPartnerIds = [...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))];

        const chatPartners = await User.find({ _id: {$in: chatPartnerIds }}).select("-password");

        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners  controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}