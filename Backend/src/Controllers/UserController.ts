import { Request, Response, NextFunction } from "express";
import { signupSchema, loginSchema } from "../Schemas/user.Zodschema";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import UserModel, { type IUser } from "../Models/UsersModel";

export async function createUser(req: Request, res: Response) {
  const resultOfParsing = signupSchema.safeParse(req.body.formData);
  console.log(resultOfParsing);
  res.send("ma chuda na ");
}

export async function loginUser(req: Request, res: Response) {
  const resultOfParsing = loginSchema.safeParse(req.body.formData);
  if (resultOfParsing.success) {
    const existingUser = await UserModel.findOne({
      email: resultOfParsing.data.email,
    });
    if (existingUser) {
      const token = generateToken(existingUser.id);
      const refreshToken = generateRefreshToken(existingUser.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
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
      res.json(existingUser)
    }else{
      res.send("user doesn't exists")
    }    
  }else{
    console.log(resultOfParsing.error);
    res.send("Error Occured")
  }
}
