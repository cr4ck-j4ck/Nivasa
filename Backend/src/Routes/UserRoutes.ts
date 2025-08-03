import express, { RequestHandler } from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser, loginUser, verifyConnection, verifyEmailToken } from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";

const router = express.Router();

router.post("/user/signup", createUser);

router.post("/user/login",loginUser);

router.get("/user/sse/:id",verifyConnection)

router.get("/user/verifyEmail-token",verifyEmailToken)

router.get("/auth/status",verifyToken , (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).send("User Not Found");
  }
});

export default router;
