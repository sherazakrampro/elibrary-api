import express from "express";
import { regiterBook } from "../controllers/bookController";

const bookRouter = express.Router();

// user registration route
bookRouter.post("/register", regiterBook);

export default bookRouter;
