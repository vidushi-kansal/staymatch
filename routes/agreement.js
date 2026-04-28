const express = require("express");
const router = express.Router();

/* -------- GENERATE AGREEMENT -------- */

router.post("/generate", (req, res) => {
    try {
        const {
            name1,
            name2,
            rent,
            rules,
            chores,
            sleep,
            clean,
            noise
        } = req.body;

        // 1. Safety Check: Ensure required fields exist
        if (!name1 || !name2 || !rent) {
            return res.status(400).json({ msg: "Missing essential contract data." });
        }

        // 2. Format numbers and handle fallback text
        const totalRent = Number(rent);
        const splitRent = Math.floor(totalRent / 2);
        const displayRules = rules || "Standard StayMatch mutual respect protocols.";
        const displayChores = chores || "Chores to be distributed weekly via StayMatch dashboard.";

        const agreement = `
======================================
         ROOMMATE AGREEMENT
======================================

This legally-themed protocol is synthesized between:

1. RESIDENT ALPHA: ${name1}
2. RESIDENT BETA:  ${name2}

--------------------------------------

💰 FINANCIAL DISBURSEMENT:
Total Monthly Rent: ₹${totalRent.toLocaleString()}
Per-Resident Share: ₹${splitRent.toLocaleString()}
Utility Protocol: 50/50 split unless otherwise negotiated.

--------------------------------------

🧹 OPERATIONAL CHORES:
${displayChores}

--------------------------------------

🏠 HOUSE RULES & GOVERNANCE:
${displayRules}

--------------------------------------

🧠 NEURAL LIFESTYLE ALIGNMENT:
- Sleep Schedule Compatibility:  ${sleep || 5}/10
- Cleanliness Maintenance:       ${clean || 5}/10
- Noise Decibel Tolerance:      ${noise || 5}/10

--------------------------------------

⚖️ GENERAL TERMS:
- Both parties agree to maintain the 'Peaceful Enjoyment' of the premises.
- Significant conflicts will be mediated via the StayMatch Conflict Predictor.
- This agreement serves as a social and moral bond between residents.

--------------------------------------

✍️ EXECUTION OF AGREEMENT:

_____________________           _____________________
Resident: ${name1}               Resident: ${name2}

Synthesized on: ${new Date().toLocaleDateString()}
Protocol ID: SM-${Math.random().toString(36).substring(7).toUpperCase()}
======================================
`;

        // Send response back to frontend
        res.json({ agreement });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ msg: "Internal Synthesis Engine Failure" });
    }
});

module.exports = router;