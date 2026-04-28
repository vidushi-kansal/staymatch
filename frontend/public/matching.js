console.log("Matching JS Loaded");

/* -------- UPDATE SLIDER VALUES -------- */
function updateVal(id){
    document.getElementById("val-"+id).innerText =
    document.getElementById(id).value;
}

/* -------- FIND MATCHES -------- */
async function findMatches() {

    const userPrefs = {
        sleep: +document.getElementById("sleep").value,
        clean: +document.getElementById("clean").value,
        noise: +document.getElementById("noise").value,
        study: +document.getElementById("study").value,
        social: +document.getElementById("social").value,
        smoking: +document.getElementById("smoking").value
    };

    try {
        const res = await fetch("http://localhost:5000/api/match", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userPrefs })
        });

        const matches = await res.json();

        console.log("Matches:", matches);

        renderMatches(matches);

    } catch (err) {
        console.error(err);
        alert("Error connecting to backend");
    }
}

/* -------- RENDER MATCHES -------- */
function renderMatches(matches){

    const container = document.getElementById("results");
    container.innerHTML = "";

    if(!matches.length){
        container.innerHTML = `<p>No matches found</p>`;
        return;
    }

    matches.forEach((m, index) => {

        const tag =
            index === 0 ? "🥇 Best Match" :
            index === 1 ? "🥈 Second Match" :
            index === 2 ? "🥉 Third Match" : "Match";

        const div = document.createElement("div");
        div.className = "match-card";

        div.innerHTML = `
            <div class="match-left">

                <span class="match-tag">${tag}</span>

                <h3>${m.name}</h3>

                <p class="confidence">AI Confidence: High</p>

                <button class="view-btn" onclick="showDetails(${index})">
                    View Compatibility
                </button>

                <button class="chat-btn" onclick="startChat('${m.name}')">
                    💬 Chat
                </button>

            </div>

            <div class="match-right">
                <div class="score-circle">${m.score}%</div>
            </div>
        `;

        container.appendChild(div);
    });

    window.matchesData = matches;
}

/* -------- START CHAT -------- */
function startChat(name) {

    localStorage.setItem("matchedUser", name);

    // AUTO get current user from login (better than prompt)
    const myName = localStorage.getItem("loggedInUser") || "User";

    localStorage.setItem("currentUser", myName);

    window.location.href = "chat.html";
}

/* -------- VIEW DETAILS -------- */
let myChart = null;

function showDetails(index) {
    const roommate = window.matchesData[index];
    const modal = document.getElementById('chartModal');
    const ctx = document.getElementById('compatibilityChart').getContext('2d');

    const myPrefs = [
        +document.getElementById("sleep").value,
        +document.getElementById("clean").value,
        +document.getElementById("noise").value,
        +document.getElementById("study").value,
        +document.getElementById("social").value
    ];

    const roomiePrefs = [
        roommate.preferences.sleep,
        roommate.preferences.clean,
        roommate.preferences.noise,
        roommate.preferences.study,
        roommate.preferences.social
    ];

    modal.style.display = 'block';
    document.getElementById('modalName').innerText =
        `Comparison with ${roommate.name}`;

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sleep', 'Clean', 'Noise', 'Study', 'Social'],
            datasets: [
                {
                    label: 'You',
                    data: myPrefs,
                    fill: true,
                    backgroundColor: 'rgba(78, 68, 206, 0.2)',
                    borderColor: '#4e44ce',
                    pointBackgroundColor: '#4e44ce'
                },
                {
                    label: roommate.name,
                    data: roomiePrefs,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#fff' },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}