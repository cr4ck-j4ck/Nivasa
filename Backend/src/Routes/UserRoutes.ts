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
  authLimiter,
  passwordResetLimiter,
  tokenVerificationLimiter,
  passwordResetCompletionLimiter
} from "../utils/rateLimiter";
import { uploadAvatar } from "../config/cloudinary";
import { validate } from "../utils/validate";
import { z } from "zod";
import {
  signupSchema,
  loginSchema,
  userIdParamSchema,
  verificationTokenSchema,
  wishlistBodySchema,
  wishlistParamsSchema,
  forgotPasswordSchema,
  verifyResetTokenSchema,
  resetPasswordSchema,
  updateUserProfileSchema
} from "../Schemas/user.Zodschema";

const router = express.Router();

const signupValidation = z.object({ body: signupSchema });
const loginValidation = z.object({ body: loginSchema });
const userIdParamValidation = z.object({ params: userIdParamSchema });
const verificationTokenValidation = z.object({ query: verificationTokenSchema });
const wishlistBodyValidation = z.object({ body: wishlistBodySchema });
const wishlistParamsValidation = z.object({ params: wishlistParamsSchema });
const forgotPasswordValidation = z.object({ body: forgotPasswordSchema });
const verifyResetTokenValidation = z.object({ body: verifyResetTokenSchema });
const resetPasswordValidation = z.object({ body: resetPasswordSchema });
const updateUserProfileValidation = z.object({ body: updateUserProfileSchema });

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

router.post("/user/signup", authLimiter, validate(signupValidation), createUser);

router.post("/user/login", authLimiter, validate(loginValidation), loginUser);

router.get("/user/verification-stream/:id", validate(userIdParamValidation), verifcationStream);

router.get("/user/verifyEmail-token", validate(verificationTokenValidation), verifyEmailToken);

router.get("/auth/status", verifyToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).send("User Not Found");
  }
});

router.post("/user/wishlist", verifyToken, validate(wishlistBodyValidation), addToWishlist);
router.delete("/user/wishlist/:id", verifyToken, validate(wishlistParamsValidation), removeFromWishlist);

router.get("/user/getWishlist", verifyToken, getWishList);

// Password reset routes
router.post("/user/forgot-password", passwordResetLimiter, validate(forgotPasswordValidation), requestPasswordReset);
router.post("/user/verify-reset-token", tokenVerificationLimiter, validate(verifyResetTokenValidation), verifyPasswordResetToken);
router.post("/user/reset-password", passwordResetCompletionLimiter, validate(resetPasswordValidation), resetPassword);

// Profile update route
router.put("/user/profile", verifyToken, uploadAvatar.single('avatar'), handleMulterError, validate(updateUserProfileValidation), updateUserProfile);

export default router;
