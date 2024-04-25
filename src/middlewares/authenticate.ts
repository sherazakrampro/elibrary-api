import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const parsedToken = token.split(" ")[1];
  const decoded = verify(parsedToken, config.jwtSecret as string);
  console.log("decodedToken:", decoded);
  next();
};

export default authenticate;
