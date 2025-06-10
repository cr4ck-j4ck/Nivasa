require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const Listingmodel = require("./Models/UsersModel");
const wrapAsync = require("./utils/wrapAsync");
const UsersModel = require('./Models/UsersModel');
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/",(req,res)=>{
    res.send("Hii");
});

app.get("/listings",wrapAsync(async (req,res)=>{
    await initalizeDB();
    res.send("<h1>Data Insert Route<h1/>");
}));

app.listen(PORT,()=>{
    console.log(`started Listening on port ${PORT}`);
});