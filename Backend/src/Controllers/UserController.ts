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
const SALT_ROUNDS = 12;

const clients = new Map<string, Response>(); // key = userId, value = res object

export const createUser: RequestHandler = async (req, res) => {
  try {
    const resultOfParsing = signupSchema.parse(req.body.formData);
    const hashedPassword = await bcrypt.hash(
      resultOfParsing.password,
      SALT_ROUNDS
    );
    const payloadJWT = { ...resultOfParsing, password: hashedPassword };
    const uniqueUserID = uuidv4();
    const verificationToken = generateToken({ userData: payloadJWT }, "10min");
    // const sentMailResponse = await sendMail(
    //   resultOfParsing.email,
    //   `http://${process.env.BACKEND_URL}/user/verifyEmail-token?Vtoken=${verificationToken}`
    // );
    console.log("Sent Mail response");
    clients.set(uniqueUserID, res);
    res.json({ uuid: uniqueUserID });
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = JSON.parse(err.message)[0].message;
      console.log(errorMessage);
      res.status(400).send(errorMessage);
      return;
    }
    console.log(err);
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
      console.log("----", existingUser._id);
      if (passwordIsCorrect) {
        const token = generateToken({ userId: existingUser._id }, "7d");
        const refreshToken = generateRefreshToken(existingUser._id as string);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
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
      console.log(errorMessage);
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

    clients.set(id, res);
    console.log(clients)
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
    console.log(verifyResult);
    const existingUser = await UserModel.findOne({
      email: verifyResult.userData.email,
    });
    if (existingUser) {
      console.log(existingUser);
      res.send("Verification link is already used");
      return;
    }
    const newUser = (await UserModel.create(verifyResult.userData)).toObject();
    const token = generateToken({ userId: newUser._id }, "7d");
    const refreshToken = generateRefreshToken(newUser._id as string);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      console.log(err.message);
      res.redirect(`${process.env.CLIENT_URL}/auth/?errMsg=${err.message}`);

      return;
    }
    res.send("error occurred from the backend");
  }
};
