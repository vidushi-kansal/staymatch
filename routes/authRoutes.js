const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async(req,res)=>{
const {name,email,password} = req.body;

const hashed = await bcrypt.hash(password,10);

const user = await User.create({
name,email,password:hashed,
preferences:{sleep:5,clean:5,noise:5,study:5,social:5,smoking:0}
});

const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

res.json({token});
});

router.post("/login", async(req,res)=>{
const {email,password} = req.body;

const user = await User.findOne({email});
if(!user) return res.json({msg:"No user"});

const ok = await bcrypt.compare(password,user.password);
if(!ok) return res.json({msg:"Wrong pass"});

const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

res.json({token});
});

module.exports = router;