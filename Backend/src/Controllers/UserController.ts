import { Request, Response, NextFunction, response } from "express";
import { signupSchema, loginSchema } from "../Schemas/user.Zodschema";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import UserModel, { type IUser } from "../Models/UsersModel";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

const SALT_ROUNDS = 12;

export async function createUser(req: Request, res: Response) {
  try {
    const resultOfParsing = signupSchema.parse(req.body.formData);
    const hashedPassword = await bcrypt.hash(
      resultOfParsing.password,
      SALT_ROUNDS
    );
    console.log(req.body.formData)
    const newUser = (
      await UserModel.create({ ...req.body.formData, password: hashedPassword })
    ).toObject();
    console.log(newUser)
    const token = generateToken(newUser._id as string);
    const refreshToken = generateRefreshToken(newUser._id as string);
    //  Set tokens as HTTP-only cookies
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
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    const { password, ...responseUser } = newUser;
    console.log(responseUser);
    res.json(responseUser);
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = JSON.parse(err.message)[0].message;
      console.log(errorMessage);
      return res.status(400).send(errorMessage);
    }
    console.log(err);
    res.status(400).send("Some Issue Occurred on Catch !!");
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const resultOfParsing = loginSchema.parse(req.body.formData);
    const existingUser = (await UserModel.findOne({
      email: resultOfParsing.email,
    }))?.toObject();
    if (existingUser) {
      const passwordIsCorrect = await bcrypt.compare(
        resultOfParsing.password,
        existingUser.password
      );
      console.log("----",existingUser._id)
      if (passwordIsCorrect) {
        const token = generateToken(existingUser._id as string);
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
      return res.status(400).send(errorMessage);
    } else {
      console.log(err);
    }
  }
}
