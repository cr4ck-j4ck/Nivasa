import express, { RequestHandler } from "express";
import asyncWrapper from "../utils/wrapAsync";
import {
  addToWhislist,
  createUser,
  getWishList,
  loginUser,
  verifcationStream,
  verifyEmailToken,
  removeFromWishlist
} from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";

const router = express.Router();

router.post("/user/signup", createUser);

router.post("/user/login", loginUser);

router.get("/user/verification-stream/:id", verifcationStream);

router.get("/user/verifyEmail-token", verifyEmailToken);

router.get("/auth/status", verifyToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).send("User Not Found");
  }
});

router.get("/user/wishlist", verifyToken, addToWhislist);
router.delete("/user/wishlist/:id",verifyToken,removeFromWishlist)

router.get("/user/getWishlist", verifyToken, getWishList);

export default router;
