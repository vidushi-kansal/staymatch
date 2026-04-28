const sender = localStorage.getItem("currentUser");
const receiver = localStorage.getItem("matchedUser");

document.getElementById("chatTitle").innerText =
    `Chat with ${receiver}`;

/* -------- SEND MESSAGE -------- */
async function sendMsg() {

    const message = document.getElementById("msg").value;

    if (!message) return;

    await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender,
            receiver,
            message
        })
    });

    document.getElementById("msg").value = "";

    loadChat();
}

/* -------- LOAD CHAT -------- */
async function loadChat() {

    const res = await fetch(
        `http://localhost:5000/api/chat/${sender}/${receiver}`
    );

    const data = await res.json();

    const box = document.getElementById("chatBox");
    box.innerHTML = "";

    data.forEach(m => {

        const div = document.createElement("div");

        div.className =
            "msg " + (m.sender === sender ? "me" : "other");

        div.innerText = m.message;

        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}

/* -------- AUTO REFRESH -------- */
setInterval(loadChat, 1500);

/* -------- FIRST LOAD -------- */
loadChat();