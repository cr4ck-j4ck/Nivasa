import { Request, Response, NextFunction } from "express";
import { signupSchema, loginSchema } from "../Schemas/user.Zodschema";
import { generateToken, generateRefreshToken } from "../JWT/JWT";
import UserModel, { type IUser } from "../Models/UsersModel";

export async function createUser(req: Request, res: Response) {
  const resultOfParsing = signupSchema.safeParse(req.body.formData);
  if(resultOfParsing.success){
    const newUser = await UserModel.create(resultOfParsing.data);
    console.log(newUser);
    const token = generateToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
       // Set tokens as HTTP-only cookies
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
    res.json(newUser);
  }else{
    console.log("parsing ho rahi hai",resultOfParsing);
    res.send("parse nahi hua");
  }  
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
