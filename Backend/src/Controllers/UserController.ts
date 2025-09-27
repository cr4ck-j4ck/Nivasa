import { signupSchema, loginSchema } from "../Schemas/user.Zodschema";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import UserModel, { type IUser } from "../Models/UsersModel";
import argon2 from "argon2";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { ZodError } from "zod";
import { RequestHandler } from "express-serve-static-core";
import sendMail from "./gmail";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import ListingModel from "../Models/ListingModel";
import {
  generateResetToken,
  hashResetToken,
  verifyResetToken,
  validatePasswordStrength,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail
} from "../utils/passwordReset";

const clients = new Map<string, Response>(); // key = userId, value = res object

export const createUser: RequestHandler = async (req, res) => {
  try {
    const resultOfParsing = signupSchema.parse(req.body.formData);
    const existingUser = await UserModel.findOne({
      email: resultOfParsing.email,
    });
    if (!existingUser) {
      const hashedPassword = await argon2.hash(resultOfParsing.password);
      const uniqueUserID = uuidv4();
      const payloadJWT = {
        ...resultOfParsing,
        password: hashedPassword,
        uuid: uniqueUserID,
      };
      const verificationToken = generateToken(
        { userData: payloadJWT },
        "10min"
      );
      const sentMailResponse = await sendMail(
        resultOfParsing.email,
        `http://${process.env.BACKEND_URL}/user/verifyEmail-token?Vtoken=${verificationToken}`
      );
      clients.set(uniqueUserID, res);
      res.json({ uuid: uniqueUserID });
    } else {
      res.status(409).send("User Already Exists");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      const errorMessage = JSON.parse(err.message)[0].message;
      res.status(400).send(errorMessage);
      return;
    }
    res.status(400).send("Some Issue Occurred on Catch !!");
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const resultOfParsing = loginSchema.parse(req.body.formData);
    const existingUser = (
      await UserModel.findOne({
        email: resultOfParsing.email,
      })
    )?.toObject();
    if (existingUser) {
      const passwordIsCorrect = await argon2.verify(
        existingUser.password,
        resultOfParsing.password
      );
      if (passwordIsCorrect) {
        const token = generateToken({ userId: existingUser._id }, "7d");
        const refreshToken = generateRefreshToken(existingUser._id as string);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          domain: process.env.NODE_ENV === "production" ? ".nivasa.site" : "localhost",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          domain: process.env.NODE_ENV === "production" ? ".nivasa.site" : "localhost",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        const { password, ...responseObject } = existingUser;
        res.json(responseObject);
      } else {
        res.status(401).send("Wrong password!!");
      }
    } else {
      res.status(400).send("user doesn't exists. Wrong Email");
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = JSON.parse(err.message)[0].message;
      res.status(400).send(errorMessage);
      return;
    } else {
      console.log(err);
    }
  }
};

export const verifcationStream: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(
      `data : ${JSON.stringify("Ha bhai cheetey chal raha hai na ")}\n\n`
    );
    clients.set(id, res);
    req.on("close", () => {
      clients.delete(id);
    });
  } catch (err) {
    console.log(err);
  }
};
type customJWTPayload = JwtPayload & {
  userData: {
    email: string;
    firstName: string;
    lastName: string;
    uuid: string;
  };
};

export const verifyEmailToken: RequestHandler = async (req, res) => {
  const Vtoken = req.query.Vtoken;
  if (!Vtoken) return;
  try {
    const verifyResult = jwt.verify(
      Vtoken as string,
      process.env.JWT_SECRET!
    ) as customJWTPayload;
    const clientRes = clients.get(verifyResult.userData.uuid);
    if (clientRes) {
      const existingUser = await UserModel.findOne({
        email: verifyResult.userData.email,
      });
      if (existingUser) {
        res.send("Verification link is already used");
        return;
      }
      const newUser = (
        await UserModel.create(verifyResult.userData)
      ).toObject();
      const token = generateToken({ userId: newUser._id }, "7d");
      const refreshToken = generateRefreshToken(newUser._id as string);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        domain: process.env.NODE_ENV === "production" ? ".nivasa.site" : "localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        domain: process.env.NODE_ENV === "production" ? ".nivasa.site" : "localhost",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      const streamRes = {
        verified: true,
        userData: verifyResult.userData,
      };
      clientRes?.write(`data: ${JSON.stringify(streamRes)}\n\n`);
      clientRes.end();
      clients.delete(verifyResult.userData.uuid);
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } else {
      res.redirect(
        `${process.env.CLIENT_URL}/auth/?errMsg=${"Email is Already Verified!"}`
      );
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.redirect(`${process.env.CLIENT_URL}/auth/?errMsg=${err.message}`);

      return;
    }
    res.send("error occurred from the backend");
  }
};

export const addToWishlist: RequestHandler = async (req, res) => {
  try {
    const { listingId } = req.body;
    console.log("Request recieved ")
    if (listingId) {
      const existingListing = await ListingModel.findById(listingId);
      if (existingListing) {
        const userId = req.user?.id;
        if (userId) {
          await UserModel.findByIdAndUpdate(userId, {
            $addToSet: { wishlist: listingId },
          });
          res.send("Added To Wishlist");
        } else {
          res.status(404).send("Please provide ListingID!!");
        }
      } else {
        res.status(404).send("Listing Doesn't Exists!!");
      }
    } else {
      res.status(404).send("Please provide Listing ID!!");
    }
  } catch (err) {
    console.log(err);
    res.status(503).send("Some error occured on DB");
  }
};

export const removeFromWishlist: RequestHandler = async (req, res) => {
  try {
    const { id: listingId } = req.params;
    if (listingId) {
      const userId = req.user?.id;
      if (userId) {
        await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { wishlist: listingId } },
          { new: true }
        );
        res.send("removed From Wishlist");
      } else {
        res.status(404).send("Please provide ListingID!!");
      }
    } else {
      res.status(404).send("Please provide Listing ID!!");
    }
  } catch (err) {
    console.log(err);
    res.status(503).send("Some error occured on DB");
  }
};

export const getWishList: RequestHandler = async (req, res) => {
  const existingUser = await UserModel.findById(req.user?._id).populate(
    "wishlist"
  );
  if (existingUser) {
    if (existingUser.wishlist?.length) {
      res.send(existingUser.wishlist);
    } else {
      res.send("Oops! You don't have any Wishlist");
    }
  } else {
    res.status(404).send("User Doesn't exists!!");
  }
};

// Password Reset Functions

export const requestPasswordReset: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        code: 'EMAIL_REQUIRED'
      });
    }

    // Always return success response to prevent email enumeration
    const successResponse = {
      message: 'If an account with that email exists, we have sent a password reset link.',
      code: 'RESET_EMAIL_SENT'
    };

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Return success even if user doesn't exist (security)
      return res.status(200).json(successResponse);
    }

    // Check if user is a Google OAuth user
    if (user.provider === 'google') {
      return res.status(200).json(successResponse); // Don't reveal it's a Google user
    }

    // Rate limiting check at user level
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    if (user.passwordResetLastAttempt && user.passwordResetLastAttempt > fifteenMinutesAgo) {
      if ((user.passwordResetAttempts || 0) >= 3) {
        return res.status(200).json(successResponse); // Don't reveal rate limiting
      }
    } else {
      // Reset attempts if more than 15 minutes have passed
      user.passwordResetAttempts = 0;
    }

    // Generate and hash reset token
    const resetToken = generateResetToken();
    const hashedToken = await hashResetToken(resetToken);

    // Update user with reset token info
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
    user.passwordResetLastAttempt = now;

    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.firstName);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Still return success to prevent information disclosure
    }

    res.status(200).json(successResponse);
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const verifyPasswordResetToken: RequestHandler = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        valid: false,
        error: 'Token is required',
        code: 'TOKEN_REQUIRED'
      });
    }

    const user = await UserModel.findOne({
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user || !user.passwordResetToken) {
      return res.status(200).json({
        valid: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    const isValidToken = await verifyResetToken(token, user.passwordResetToken);

    if (!isValidToken) {
      return res.status(200).json({
        valid: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(200).json({
      valid: true,
      message: 'Token is valid',
      code: 'VALID_TOKEN'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      valid: false,
      error: 'An error occurred while verifying the token',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Token and new password are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet requirements',
        details: passwordValidation.errors,
        code: 'WEAK_PASSWORD'
      });
    }

    const user = await UserModel.findOne({
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user || !user.passwordResetToken) {
      return res.status(400).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    const isValidToken = await verifyResetToken(token, user.passwordResetToken);

    if (!isValidToken) {
      return res.status(400).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetAttempts = 0;
    user.passwordResetLastAttempt = undefined;

    await user.save();

    // Send confirmation email
    try {
      await sendPasswordResetConfirmationEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      message: 'Password has been reset successfully',
      code: 'PASSWORD_RESET_SUCCESS'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: 'An error occurred while resetting your password',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Profile Update Function
export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED'
      });
    }



    const { firstName, lastName, email, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'First name, last name, and email are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: 'Email is already taken by another user',
        code: 'EMAIL_TAKEN'
      });
    }

    // Validate bio length
    if (bio && bio.length > 300) {
      return res.status(400).json({
        error: 'Bio must be 300 characters or less',
        code: 'BIO_TOO_LONG'
      });
    }

    // Prepare update data
    const updateData: Partial<IUser> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      bio: bio ? bio.trim() : undefined
    };

    // Handle avatar upload if present (Cloudinary automatically handles the upload)
    if (req.file) {
      // Cloudinary URL is available in req.file.path
      updateData.avatar = req.file.path;
    }

    // Update user profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-password -passwordResetToken -passwordResetExpires -passwordResetAttempts -passwordResetLastAttempt'
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Return the updated user data in the same format as login/auth responses
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'An error occurred while updating your profile',
      code: 'INTERNAL_ERROR'
    });
  }
};
