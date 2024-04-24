import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../types/userTypes";

// Register a user controller
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
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while checking for user"));
  }

  // 3. password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. create user
  let newUser: User;
  try {
    newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  // 5. token generation - JWT
  try {
    const token = sign({ _id: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    // 6. response
    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing token"));
  }
};

// Login a user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // 1. validation
  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // 2. check if user exists
  let existingUser: User | null;
  try {
    existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      const error = createHttpError(401, "User not found!");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while checking for user"));
  }

  // 3. check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    const error = createHttpError(401, "Invalid password");
    return next(error);
  }

  // 4. sign a token for the user
  try {
    const token = sign({ _id: existingUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    // 5. response
    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while signing token"));
  }
};

export { registerUser, loginUser };
