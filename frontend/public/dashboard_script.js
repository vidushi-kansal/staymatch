document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------
       👤 LOAD USER
    --------------------------------*/
    const storedUser = JSON.parse(localStorage.getItem("stayMatchUser"));

    if (!storedUser) {
        window.location.href = "index.html";
        return;
    }

    /* -------------------------------
       👋 GREETING
    --------------------------------*/
    const greeting = document.getElementById("user-greeting");

    if (greeting) {
        greeting.innerText = `Welcome back, ${storedUser.name} 👋`;
    }

    /* -------------------------------
       🏆 LOAD FINAL VERDICT
    --------------------------------*/
    const verdictBox = document.getElementById("verdictText");
    const storedVerdict = localStorage.getItem("finalVerdict");

    if (verdictBox) {
        if (storedVerdict) {
            verdictBox.innerText = storedVerdict;
        } else {
            verdictBox.innerText = "Run Smart Analysis to see result...";
        }
    }

});


/* -------------------------------
   🔓 LOGOUT
--------------------------------*/
function logout() {
    localStorage.removeItem("stayMatchUser");
    localStorage.removeItem("finalVerdict"); // optional cleanup
    window.location.href = "index.html";
}


/* -------------------------------
   🚀 NAVIGATION HELPERS
--------------------------------*/
function openMatching() {
    window.location.href = "matching.html";
}

/* -------------------------------
   🌍 GLOBAL EXPORT
--------------------------------*/

window.logout = logout;
window.openMatching = openMatching;
