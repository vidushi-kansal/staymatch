const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
user:String,
roommate:String,
rating:Number,
comment:String
});

module.exports = mongoose.model("Feedback",feedbackSchema);