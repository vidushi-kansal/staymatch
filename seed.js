const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function seed(){

const data = fs.readFileSync("dataset/staymatch_lifestyle_dataset.csv","utf-8");
const rows = data.trim().split("\n");

for(let i=1;i<rows.length;i++){
const cols = rows[i].split(",");

await User.create({
name:cols[0],
email:cols[0]+"@mail.com",
password:"123456",
preferences:{
sleep:+cols[1],
clean:+cols[2],
noise:+cols[3],
study:+cols[4],
social:+cols[5],
smoking:+cols[6]
}
});
}

console.log("DATA INSERTED");
process.exit();
}

seed();