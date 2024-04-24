import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// Register a book controller
const regiterBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Book registered successfully" });
};

export { regiterBook };
