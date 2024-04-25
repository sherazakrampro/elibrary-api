import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

// types
export interface AuthRequest extends Request {
  userId: string;
}

// authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  // check if token exists
  if (!token) {
    return next(createHttpError(401, "authorization token is required"));
  }

  // check if token is valid
  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (error) {
    console.log(error);
    return next(createHttpError(401, "token is wrong or expired"));
  }
};

export default authenticate;
