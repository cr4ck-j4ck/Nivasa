import { Request } from "express";
import { IUser } from "../Models/UsersModel";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
