const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

/* -------- SEND MESSAGE -------- */
router.post("/send", async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        const newMsg = new Chat({ sender, receiver, message });
        await newMsg.save();

        res.json({ msg: "Message sent" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Send failed" });
    }
});

/* -------- GET CHAT (BOTH SIDES) -------- */
router.get("/:user1/:user2", async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Chat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetch failed" });
    }
});

module.exports = router;