const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema({
    name: String,
    city: String,
    location: String,
    price: Number,
    contact: String,
    image: String,
    owner: String
});

module.exports = mongoose.model("PG", pgSchema);