import { Router } from "express";
const OuathRouter = Router();
import { Request, Response } from "express";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import passport from "passport";

const SuccessOauthHandler = (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    // Generate JWT tokens
    const token = generateToken({userId : user._id},"7d");
    const refreshToken = generateRefreshToken(user._id);

    // Set tokens as HTTP-only cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none":"lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none":"lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`);
  } catch (error) {
    console.error("JWT generation error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

OuathRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

OuathRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false,
  }),
  SuccessOauthHandler
);

export default OuathRouter;
