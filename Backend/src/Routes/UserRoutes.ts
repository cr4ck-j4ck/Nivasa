import express from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser,loginUser } from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";

const router = express.Router();

router.route("/users/signup").post(asyncWrapper(createUser));

router.route("/users/login").post(asyncWrapper(loginUser));

router.get("/auth/status", verifyToken, (req, res) => {
  if (req.user) {
    // setTimeout(() => {
        res.json(req.user);
    // }, 3200);
  } else {
    setTimeout(()=>{
      res.status(401).send("User Not Found")
    },3200)
  }
});

export default router;
