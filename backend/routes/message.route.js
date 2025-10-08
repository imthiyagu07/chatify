import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
    res.send("Message send");
})

export default router;