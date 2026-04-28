const express = require("express");
const router = express.Router();
const PG = require("../models/PG");

/* GET PGs */
router.get("/", async (req, res) => {

    const { city, location, price } = req.query;

    let filter = {};

    if(city) filter.city = new RegExp(city, "i");
    if(location) filter.location = new RegExp(location, "i");
    if(price) filter.price = { $lte: Number(price) };

    const pgs = await PG.find(filter);

    res.json(pgs);
});

/* ADD PG */
router.post("/", async (req, res) => {

    const newPG = new PG(req.body);
    await newPG.save();

    res.json({ msg: "PG Added" });
});

module.exports = router;