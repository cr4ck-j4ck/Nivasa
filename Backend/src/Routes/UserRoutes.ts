import express from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser, loginUser } from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";

const router = express.Router();

router.post("/users/signup", asyncWrapper(createUser));

router.route("/users/login").post(asyncWrapper(loginUser));

router.get("/auth/status", verifyToken, (req, res) => {
  if (req.user) {
    // setTimeout(() => {
    res.json(req.user);
    // }, 3200);
  } else {
    res.status(401).send("User Not Found");
  }
});

export default router;
