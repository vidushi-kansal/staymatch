const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:String,
email:String,
password:String,
preferences:{
sleep:Number,
clean:Number,
noise:Number,
study:Number,
social:Number,
smoking:Number
}
});

module.exports = mongoose.model("User",userSchema);