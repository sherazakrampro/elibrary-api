import path from "node:path";
import express from "express";
import { regiterBook } from "../controllers/bookController";
import multer from "multer";

const bookRouter = express.Router();

// file-storage-middleware-(multer)
const upload = multer({
  dest: path.join(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30mb
});

// book registration route
bookRouter.post(
  "/register",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  regiterBook
);

export default bookRouter;
