import { Request, Response, NextFunction } from "express";
import { signupSchema } from "../Schemas/user.Zodschema";


export async function createUser(req: Request, res: Response) {
  const resultOfParsing = signupSchema.safeParse(req.body.formData);
  res.send("ma chuda na ");
}


