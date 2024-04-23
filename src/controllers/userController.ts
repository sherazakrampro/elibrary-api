import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../models/userModel";

// register a user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // check-in database
  const user = await User.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User already exists");
    return next(error);
  }
  // process
  // response
  res.json({
    message: "user registered successfully",
  });
};

export { registerUser };
