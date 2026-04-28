const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

router.post("/predict", (req, res) => {
    const results = [];
    // Path to your staymatch_lifestyle_dataset.csv
    const filePath = path.join(__dirname, "../dataset/staymatch_lifestyle_dataset.csv");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ msg: "CSV Dataset missing" });
    }

    const userInputs = req.body.user;

    fs.createReadStream(filePath)
        .pipe(csv({
            skipComments: true,
            stripBom: true // 🔥 Fixes the invisible character bug from Excel/Google Sheets
        }))
        .on("data", (row) => {
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                // Clean all hidden characters and whitespace from headers
                const cleanKey = key.trim().replace(/^\ufeff/, '');
                cleanRow[cleanKey] = row[key]?.trim();
            });

            results.push({
                name: cleanRow["Name"] || "Unknown User", 
                preferences: {
                    sleep: parseInt(cleanRow["Sleep_Schedule(1-10)"]) || 5,
                    clean: parseInt(cleanRow["Cleanliness(1-10)"]) || 5,
                    noise: parseInt(cleanRow["Noise_Tolerance(1-10)"]) || 5,
                    study: parseInt(cleanRow["Study_Habits(1-10)"]) || 5,
                    social: parseInt(cleanRow["Social_Behavior(1-10)"]) || 5
                }
            });
        })
        .on("end", () => {
            console.log(`✅ Processed ${results.length} profiles for analysis`);
            res.json(results);
        })
        .on("error", (err) => {
            console.error("CSV Parse error:", err);
            res.status(500).json({ error: "Failed to parse neural dataset" });
        });
});

module.exports = router;