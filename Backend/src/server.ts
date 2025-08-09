require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./config/db";
import ExpressError from "./utils/expressError";
import ListingRoutes from "./Routes/ListingRoutes"
import OauthRoutes from "./Routes/OauthRoutes"
import UserRoutes from "./Routes/UserRoutes"
import cookieParser from 'cookie-parser';
import "./auth";
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: [
      "https://www.nivasa.site",
      "http://localhost:5173",
      "http://192.168.1.34:5173"
    ],
    credentials: true,
  })
);

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Hii from Nivasa");
});

// Google OAuth routes
app.use("/",OauthRoutes)
app.use("/",ListingRoutes)
app.use("/",UserRoutes)


app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.send("got error from last middleware");
  }
);

app.listen(3000,() => {
  console.log(`started Listening on port ${PORT}`);
});
