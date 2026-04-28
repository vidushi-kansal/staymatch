console.log("Friction Engine Online ⚡");

const API = "http://localhost:5000/api";

window.updateVal = (id) => {
    const slider = document.getElementById(id);
    const display = document.getElementById(`val-${id}`);
    if (slider && display) display.innerText = slider.value;
};

window.predictConflict = async function () {
    const btn = document.querySelector(".sync-btn");
    const container = document.getElementById("conflict-results");
    const riskCount = document.getElementById("risk-count");

    btn.innerText = "Analyzing Neural Patterns...";
    btn.disabled = true;

    const user = {
        sleep: +document.getElementById("sleep").value,
        clean: +document.getElementById("clean").value,
        noise: +document.getElementById("noise").value,
        study: +document.getElementById("study").value,
        social: +document.getElementById("social").value
    };

    try {
        const res = await fetch(`${API}/conflict/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user })
        });

        if (!res.ok) throw new Error("Neural Server Unreachable");

        const users = await res.json();
        const results = processConflictData(users, user);

        riskCount.innerText = `${results.length} Profiles Scanned`;
        renderConflictCards(results);

    } catch (error) {
        console.error("Friction Analysis Failed:", error);
        container.innerHTML = `<div style="color:#ff4757; padding:20px;">Analysis Halted: Backend Offline ❌</div>`;
    } finally {
        btn.innerText = "Run Risk Analysis";
        btn.disabled = false;
    }
};

function processConflictData(users, user) {
    return users.map(person => {
        const t = person.preferences;
        
        // 1. Calculate the raw difference for each of the 5 dimensions
        const diffs = [
            Math.abs(user.sleep - t.sleep),
            Math.abs(user.clean - t.clean),
            Math.abs(user.noise - t.noise),
            Math.abs(user.study - t.study),
            Math.abs(user.social - t.social)
        ];

        // 2. Calculate a weighted average (Max diff is 9, so we scale to 100)
        const totalDiff = diffs.reduce((a, b) => a + b, 0);
        const avgDiff = totalDiff / 5;
        
        // 3. Scale the friction probability (0-100%)
        let probability = Math.round((avgDiff / 9) * 100);

        // 4. Determine triggers based on specific significant gaps
        let triggers = [];
        if (Math.abs(user.sleep - t.sleep) > 3) triggers.push("Sleep Schedule Clash");
        if (Math.abs(user.clean - t.clean) > 3) triggers.push("Cleanliness Gap");
        if (Math.abs(user.noise - t.noise) > 3) triggers.push("Noise Tolerance Clash");
        if (Math.abs(user.study - t.study) > 3) triggers.push("Study Habit Mismatch");
        if (Math.abs(user.social - t.social) > 3) triggers.push("Social Behavior Conflict");

        let level = probability > 60 ? "HIGH" : (probability > 30 ? "MEDIUM" : "LOW");

        return {
            name: person.name,
            probability,
            level,
            cls: `risk-${level.toLowerCase()}`,
            triggers
        };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6);
}

function renderConflictCards(list) {
    const container = document.getElementById("conflict-results");
    if (!list.length) {
        container.innerHTML = `<p>No data found</p>`;
        return;
    }

    container.innerHTML = list.map(p => `
        <div class="risk-card ${p.cls}" style="background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #fff;">${p.name}</h3>
            <p style="margin: 5px 0;"><b>Neural Friction:</b> ${p.probability}% (${p.level})</p>
            <div class="triggers" style="font-size: 0.85rem; color: #ffa502;">
                ${p.triggers.length ? p.triggers.map(t => `<span>⚠️ ${t}</span>`).join("<br>") : "✅ Lifestyle Sync Perfect"}
            </div>
        </div>
    `).join("");
}