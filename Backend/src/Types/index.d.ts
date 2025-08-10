import { Request } from "express";

interface User{
    id:string;
    _id:string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
