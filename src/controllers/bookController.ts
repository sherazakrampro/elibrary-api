import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import BookModel from "../models/bookModel";
import fs from "node:fs";

// Register a book controller
const regiterBook = async (req: Request, res: Response, next: NextFunction) => {
  // destructuring the data
  const { title, genre } = req.body;

  // types of files for typescript
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  // 1. UPLOAD COVER IMAGE
  // get cover image type => by default 'image/jpeg' (split it by '/' and get the last element 'jpeg')
  const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);

  // get cover image file name
  const coverImageFileName = files.coverImage[0].filename;

  // get cover image file path
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );

  // upload
  let coverImageUploadResult;
  try {
    coverImageUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book-covers",
        format: coverImageType,
      }
    );
  } catch (error) {
    console.log("failed to upload cover image", error);
    return next(createHttpError(500, "failed to upload cover image"));
  }

  // 2. UPLOAD BOOK FILE
  // get book file type => by default 'application/pdf' (split it by '/' and get the last element 'pdf')
  const bookFileType = files.file[0].mimetype.split("/").at(-1);

  // get book file name
  const bookFileName = files.file[0].filename;

  // get book file path
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );

  // upload
  let bookFileUploadResult;
  try {
    bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "books",
      format: bookFileType,
    });
  } catch (error) {
    console.log("failed to upload book file", error);
    return next(createHttpError(500, "failed to upload book file"));
  }

  // console.log(coverImageUploadResult);
  // console.log(bookFileUploadResult);

  // @ts-ignore
  console.log("userId", req.userId);

  // create new book
  let newBook;
  try {
    newBook = await BookModel.create({
      title,
      genre,
      author: "6627c2a3458cec770c1da90a",
      coverImage: coverImageUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
  } catch (error) {
    console.log("failed to create new book", error);
    return next(createHttpError(500, "failed to create new book"));
  }

  // delete temp files
  try {
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.log("failed to delete temp files", error);
    return next(createHttpError(500, "failed to delete temp files"));
  }

  // response
  res
    .status(201)
    .json({ message: "Book registered successfully", id: newBook._id });
};

export { regiterBook };
