require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import ListingModel from "./Models/ListingModel";
import asyncWrapper from "./utils/wrapAsync";
const UsersModel = require("./Models/UsersModel");
import { connectDB } from "./config/db";
import ExpressError from "./utils/expressError";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import "./auth"
const app = express();
import cors from "cors";
import { signupSchema } from "./Schemas/user.Zodschema";

app.use(
  cors({
    origin: [
      "https://nivasa-two.vercel.app",
      "https://nivasa-git-main-cr4ck-j4cks-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

connectDB();

app.use(
  session({
    name: "SSID",
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: "lax",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Ha chal raha hai");
  res.send("Hii from NeoVim");
});

// Google OAuth routes
app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

app.get(
  "/listing/:id",
  asyncWrapper(async (req, res) => {
    const data = await ListingModel.findById(req.params.id).populate("host");
    // setTimeout(() => {
    res.json(data);
    // }, 2000);
  })
);

app.get(
  "/listingCard/:city",
  asyncWrapper(async (req, res) => {
    const dataObjects = await ListingModel.find(
      { "location.city": req.params.city },
      { title: 1, price: 1, "gallery.Bedroom 1": 1, "location.city": 1 }
    ).limit(10);
    // setTimeout(() => {
    res.json(dataObjects);
    // }, 1000);
  })
);


app.post(
  "/users/signup",
  asyncWrapper(async (req, res) => {
    const resultOfParsing = signupSchema.safeParse(req.body.formData);
    res.send("ma chuda na ");
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
