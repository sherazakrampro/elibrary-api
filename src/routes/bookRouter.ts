import path from "node:path";
import express from "express";
import {
  listBooks,
  regiterBook,
  updateBook,
} from "../controllers/bookController";
import multer from "multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

// file-storage-middleware-(multer)
const upload = multer({
  dest: path.join(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30mb
});

// book registration route
bookRouter.post(
  "/register",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  regiterBook
);

// book updation route
bookRouter.patch(
  "/update/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// get all books
bookRouter.get("/", listBooks);

export default bookRouter;
