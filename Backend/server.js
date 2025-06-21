require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const Listingmodel = require("./Models/ListingModel");
const wrapAsync = require("./utils/wrapAsync");
const UsersModel = require('./Models/UsersModel');
const connectDB = require("./config/db");
const app = express();
const cors = require('cors');
app.use(cors({ origin: "https://nivasa-two.vercel.app/" }));
const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send("Hii");
});

app.get("/listing/:id", wrapAsync(async (req, res) => {
    const data = await Listingmodel.findById(req.params.id).populate("host");
    // setTimeout(() => {
        res.json(data);
    // }, 1000);
}));


app.get("/listingCard/:city", async (req, res) => {
    try {
        const dataObjects = await Listingmodel.find(
            { "location.city": req.params.city },
            { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
        ).limit(10);
    // setTimeout(() => {
        res.json(dataObjects);
    // }, 1000);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`started Listening on port ${PORT}`);
});