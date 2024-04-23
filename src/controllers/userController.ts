import { Request, Response, NextFunction } from "express";

// register a user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: "user registered successfully",
  });
};

export { registerUser };
