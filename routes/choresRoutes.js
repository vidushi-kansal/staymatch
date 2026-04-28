const express = require("express");
const router = express.Router();

router.post("/generate", (req, res) => {

    const { name1, name2, chores, clean1, clean2 } = req.body;

    if (!name1 || !name2 || !chores) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const choreList = chores.split(",").map(c => c.trim());

    let plan = `===== Smart Chore Plan =====\n\n`;
    plan += `👥 ${name1} & ${name2}\n\n`;

    let countA = 0, countB = 0;

    // Week 1
    plan += `--- Week 1 ---\n`;
    choreList.forEach((chore, i) => {
        let assigned;

        if (clean1 > clean2) {
            assigned = (i % 2 === 0) ? name1 : name2;
        } else {
            assigned = (i % 2 === 0) ? name2 : name1;
        }

        if (assigned === name1) countA++;
        else countB++;

        plan += `• ${chore} → ${assigned}\n`;
    });

    // Week 2 rotation
    plan += `\n--- Week 2 (Rotation) ---\n`;
    choreList.forEach((chore, i) => {
        let assigned = (i % 2 === 0) ? name2 : name1;
        plan += `• ${chore} → ${assigned}\n`;
    });

    // Smart suggestions
    if (Math.abs(clean1 - clean2) > 3) {
        plan += `\n⚠️ High cleanliness mismatch detected.\n`;
    }

    plan += `\n💡 Tip: Assign heavy cleaning tasks to more disciplined roommate.\n`;

    res.json({
        plan,
        stats: {
            [name1]: countA,
            [name2]: countB
        }
    });
});

module.exports = router;