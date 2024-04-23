import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

// register a user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  // 1. validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // 2. check-in database
  const user = await User.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User already exists");
    return next(error);
  }
  // 3. password hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  // create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  // 4. token generation - JWT
  const token = sign({ _id: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  // 5. response
  res.status(201).json({
    accessToken: token,
  });
};

export { registerUser };
