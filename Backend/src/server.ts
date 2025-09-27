require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./config/db";
import ExpressError from "./utils/expressError";
import ListingRoutes from "./Routes/ListingRoutes"
import OauthRoutes from "./Routes/OauthRoutes"
import adminRoutes from "./Routes/AdminRoutes"
import UserRoutes from "./Routes/UserRoutes"
import BookingRoutes from "./Routes/BookingRoutes"
import ReviewRoutes from "./Routes/ReviewRoutes"
import cookieParser from 'cookie-parser';
import "./auth";
import helmet from "helmet";
const app = express();
import cors from "cors";

app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Middleware to enforce HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  });
}

const allowedOriginsStr =
  process.env.ALLOWED_ORIGINS ||
  "https://www.nivasa.site,http://localhost:5173,http://192.168.1.34:5173";
const allowedOrigins = allowedOriginsStr.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

connectDB();


import { generalLimiter } from "./utils/rateLimiter";

app.use(generalLimiter);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Hii from Nivasa");
});

// Google OAuth routes
app.use("/",OauthRoutes)
app.use("/",ListingRoutes)
app.use("/",UserRoutes)
app.use("/admin",adminRoutes)
app.use("/api/bookings",BookingRoutes)
app.use("/api/reviews",ReviewRoutes)

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.send("got error from last middleware");
  }
);
app.get("/debug",(req,res)=>{
  console.log("Got request");
  res.send("Working Fine!");
})

app.listen(3000,() => {
  console.log(`started Listening on port ${PORT}`);
});
