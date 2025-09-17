import { signupSchema, loginSchema } from "../Schemas/user.Zodschema";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import UserModel, { type IUser } from "../Models/UsersModel";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { ZodError } from "zod";
import { RequestHandler } from "express-serve-static-core";
import sendMail from "./gmail";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import ListingModel from "../Models/ListingModel";
const SALT_ROUNDS = 12;

const clients = new Map<string, Response>(); // key = userId, value = res object

export const createUser: RequestHandler = async (req, res) => {
  try {
    const resultOfParsing = signupSchema.parse(req.body.formData);
    const existingUser = await UserModel.findOne({
      email: resultOfParsing.email,
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(
        resultOfParsing.password,
        SALT_ROUNDS
      );
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
      const passwordIsCorrect = await bcrypt.compare(
        resultOfParsing.password,
        existingUser.password
      );
      if (passwordIsCorrect) {
        const token = generateToken({ userId: existingUser._id }, "7d");
        const refreshToken = generateRefreshToken(existingUser._id as string);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
