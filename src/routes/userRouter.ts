import express from "express";
import { registerUser } from "../controllers/userController";

const userRouter = express.Router();

// user registration route
userRouter.post("/register", registerUser);

export default userRouter;
