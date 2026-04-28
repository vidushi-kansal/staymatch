const API = "http://localhost:5000/api";

/* -------- FEATURE 7: PREFILL FROM LOCALSTORAGE -------- */
function prefillData() {
    const saved = JSON.parse(localStorage.getItem("userPrefs"));
    if (!saved) {
        alert("No saved preferences found! Please complete the matching quiz first.");
        return;
    }
    // Added safety checks to prevent crashes if fields are missing
    if(document.getElementById("sleep")) document.getElementById("sleep").value = saved.sleep || 5;
    if(document.getElementById("clean")) document.getElementById("clean").value = saved.clean || 5;
    if(document.getElementById("noise")) document.getElementById("noise").value = saved.noise || 5;
    console.log("Data Prefilled from StayMatch Profile");
}

/* -------- GENERATE AGREEMENT (THE CORE ENGINE) -------- */
async function generateAgreement() {
    const btn = document.querySelector(".generate-btn");
    const outputElement = document.getElementById("output");

    // Ensure all elements exist before reading values to avoid "Waiting" hang
    const name1 = document.getElementById("name1").value.trim();
    const name2 = document.getElementById("name2").value.trim();
    const rent = document.getElementById("rent").value;
    const rules = document.getElementById("rules").value.trim();
    const chores = document.getElementById("chores").value.trim();
    const sleep = +document.getElementById("sleep").value || 5;
    const clean = +document.getElementById("clean").value || 5;
    const noise = +document.getElementById("noise").value || 5;

    if (!name1 || !name2 || !rent) {
        alert("CRITICAL ERROR: Resident identities and financial data required. ⚠️");
        return;
    }

    const data = { name1, name2, rent, rules, chores, sleep, clean, noise };

    btn.innerText = "Processing Neural Nodes...";
    btn.disabled = true;
    outputElement.innerText = "> Initializing AI Agreement Synthesis...\n> Analyzing lifestyle frequencies...";

    try {
        const res = await fetch(API + "/agreement/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!result.agreement) throw new Error("Synthesis Failed");

        // Calculate Compatibility
        const diff = Math.abs(sleep - 5) + Math.abs(clean - 5) + Math.abs(noise - 5);
        const score = Math.max(100 - (diff * 4), 40); 

        // Risk Detection
        let risks = [];
        if (sleep <= 3 || sleep >= 8) risks.push("⚠️ Extreme Sleep Schedule Disparity");
        if (clean <= 4) risks.push("⚠️ High Hygiene Maintenance Risk");
        if (noise >= 8) risks.push("⚠️ Decibel Tolerance Conflict Potential");

        // UI Feedback
        updateStrengthMeter(score, risks);

        const finalText = `
==============================================
         STAYMATCH AI LEGAL PROTOCOL
==============================================
PARTIES: ${name1} & ${name2}
📊 COMPATIBILITY SCORE: ${score}%

[RISK ANALYSIS]
${risks.length ? risks.join("\n") : "STATUS: All systems clear. ✅"}

[CORE AGREEMENT TERMS]
${result.agreement}

TIMESTAMP: ${new Date().toLocaleString()}
HASH ID: ${Math.random().toString(36).substring(7).toUpperCase()}
==============================================`;

        // Typewriter Effect
        outputElement.innerHTML = "";
        let i = 0;
        function type() {
            if (i < finalText.length) {
                outputElement.innerHTML = highlightText(finalText.substring(0, i + 1));
                i++;
                setTimeout(type, 1);
                outputElement.scrollTop = outputElement.scrollHeight;
            }
        }
        type();

    } catch (err) {
        console.error(err);
        outputElement.innerText = ">> [FATAL ERROR]: Connection to StayMatch Neural API lost.";
    } finally {
        btn.innerText = "Synthesize Agreement";
        btn.disabled = false;
    }
}

function updateStrengthMeter(score, risks) {
    const fill = document.getElementById("strengthFill");
    const text = document.getElementById("strengthText");
    const fixBtn = document.getElementById("fixBtn");

    fill.style.width = score + "%";
    
    if (score > 85) {
        fill.style.background = "#27c93f";
        text.innerText = "High Stability Protocol";
        fixBtn.style.display = "none";
    } else {
        fill.style.background = score > 60 ? "#ffbd2e" : "#ff5f56";
        text.innerText = score > 60 ? "Moderate Conflict Risk" : "Critical Instability Detected";
        fixBtn.style.display = "inline-block";
    }
}

function highlightText(text) {
    return text
        .replace(/(⚠️.*?$)/gm, '<span class="hl-red">$1</span>')
        .replace(/(📊.*?%)/g, '<span class="hl-blue">$1</span>')
        .replace(/(✅.*?$)/gm, '<span class="hl-green">$1</span>');
}

function downloadAgreement() {
    const text = document.getElementById("output").innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `StayMatch_Protocol.txt`;
    link.click();
}