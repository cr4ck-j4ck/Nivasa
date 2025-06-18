require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const Listingmodel = require("./Models/ListingModel");
const wrapAsync = require("./utils/wrapAsync");
const UsersModel = require('./Models/UsersModel');
const connectDB = require("./config/db");
const app = express();
const cors = require('cors');
app.use(cors({ origin: "http://localhost:5173" }));
const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send("Hii");
});


app.get("/listings/:city", async (req, res) => {
    const dataObjects = await Listingmodel.find({"location.city":req.params.city}).limit(10);
    res.json(dataObjects);
});

app.listen(PORT, () => {
    console.log(`started Listening on port ${PORT}`);
});