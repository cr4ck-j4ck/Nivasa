require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Hii");
});

app.listen(PORT,()=>{
    console.log(`started Listening on port ${PORT}`);
});