import express from "express";
import asyncWrapper from "../utils/wrapAsync";
import { createUser } from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";

const router = express.Router();

router.route("/user").get(asyncWrapper(createUser));

router.get("/auth/status", verifyToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json("chala ja yaha se kuch dikkat aa gayi bakcend per");
  }
});

export default router;
