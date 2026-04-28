const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* -------- MATCHING LOGIC -------- */

router.post("/", async (req, res) => {

    try {

        const { userPrefs } = req.body;

        const users = await User.find();

        let matches = users.map(u => {

            const p = u.preferences;

            // similarity score
            let score = 100;

            score -= Math.abs(userPrefs.sleep - p.sleep) * 5;
            score -= Math.abs(userPrefs.clean - p.clean) * 5;
            score -= Math.abs(userPrefs.noise - p.noise) * 5;
            score -= Math.abs(userPrefs.study - p.study) * 5;
            score -= Math.abs(userPrefs.social - p.social) * 5;

            if (userPrefs.smoking !== p.smoking)
                score -= 20;

            return {
                name: u.name,
                preferences: p,
                score: Math.max(score, 0)
            };
        });

        // sort best first
        matches.sort((a, b) => b.score - a.score);

        // top 5 matches
        res.json(matches.slice(0, 5));

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;