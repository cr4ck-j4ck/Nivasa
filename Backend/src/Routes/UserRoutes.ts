import express, { RequestHandler } from "express";
import {
  addToWishlist,
  createUser,
  getWishList,
  loginUser,
  verifcationStream,
  verifyEmailToken,
  removeFromWishlist,
  requestPasswordReset,
  verifyPasswordResetToken,
  resetPassword
} from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";
import {
  passwordResetLimiter,
  tokenVerificationLimiter,
  passwordResetCompletionLimiter
} from "../utils/rateLimiter";

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

router.post("/user/wishlist", verifyToken, addToWishlist);
router.delete("/user/wishlist/:id",verifyToken,removeFromWishlist)

router.get("/user/getWishlist", verifyToken, getWishList);

// Password reset routes
router.post("/user/forgot-password", passwordResetLimiter, requestPasswordReset);
router.post("/user/verify-reset-token", tokenVerificationLimiter, verifyPasswordResetToken);
router.post("/user/reset-password", passwordResetCompletionLimiter, resetPassword);

export default router;
