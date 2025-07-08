import { Request, Response, NextFunction, RequestHandler } from "express";

type CallbackFunc = (
  req: Request,
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
