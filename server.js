const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staymatch")
    .then(() => console.log("MongoDB Connected 🚀"))
    .catch(err => console.log("Mongo Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/conflict", require("./routes/conflictRoutes")); 
app.use("/api/agreement", require("./routes/agreement"));
app.use("/api/chores", require("./routes/choresRoutes"));
app.use("/api/pg", require("./routes/pgRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));


app.get("/", (req, res) => {
    res.send("StayMatch Backend Running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));