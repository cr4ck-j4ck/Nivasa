import { Request, Response, NextFunction, RequestHandler } from "express";
import { IUser } from "../Models/UsersModel";
interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: IUser;
}

type CallbackFunc = (
  req: Request | AuthenticatedRequest,
  res: Response
) => Promise<any>;

export default function asyncWrapper(func: CallbackFunc): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res).catch((err) => {
      console.error("Error caught in asyncWrapper:", err);
      return next(err);
    });
  };
}
