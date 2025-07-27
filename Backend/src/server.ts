require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import ListingModel from "./Models/ListingModel";
import wrapAsync from "./utils/wrapAsync";
const UsersModel = require("./Models/UsersModel");
import { connectDB } from "./config/db";
import ExpressError from "./utils/expressError";
import session from "express-session";
import MongoStore from "connect-mongo"
import mongoose from "mongoose";

const app = express();
import cors from "cors";

app.use(
  cors({
    origin: [
      "https://nivasa-two.vercel.app",
      "https://nivasa-git-main-cr4ck-j4cks-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials:true
  })
);

connectDB();

app.use(
  session({
    name:"SSID",
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native',
    }),
    cookie: {
      httpOnly:true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite:"lax"
    },
  })
);

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  console.log("Ha chal raha hai");
  res.send("Hii from NeoVim");
});

app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    const data = await ListingModel.findById(req.params.id).populate("host");
    // setTimeout(() => {
    res.json(data);
    // }, 2000);
  })
);

app.get(
  "/listingCard/:city",
  wrapAsync(async (req, res) => {
    
    const dataObjects = await ListingModel.find(
      { "location.city": req.params.city },
      { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
    ).limit(10);
    // setTimeout(() => {
    res.json(dataObjects);
    // }, 1000);
  })
);

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.send("got error");
  }
);

app.listen(PORT, () => {
  console.log(`started Listening on port ${PORT}`);
});
