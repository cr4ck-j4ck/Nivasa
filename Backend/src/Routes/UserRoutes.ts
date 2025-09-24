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
  resetPassword,
  updateUserProfile
} from "../Controllers/UserController";
import { verifyToken } from "../JWT/JWT";
import {
  passwordResetLimiter,
  tokenVerificationLimiter,
  passwordResetCompletionLimiter
} from "../utils/rateLimiter";
import { uploadAvatar } from "../config/cloudinary";

const router = express.Router();

// Multer error handling middleware
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size too large. Maximum size is 2MB for avatars.',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (err.message === 'Only image files are allowed!') {
      return res.status(400).json({
        error: 'Only image files are allowed.',
        code: 'INVALID_FILE_TYPE'
      });
    }
    return res.status(400).json({
      error: err.message || 'File upload error',
      code: 'UPLOAD_ERROR'
    });
  }
  next();
};

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

// Profile update route
router.put("/user/profile", verifyToken, uploadAvatar.single('avatar'), handleMulterError, updateUserProfile);

export default router;
