import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

// Register a book controller
const regiterBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book-covers",
        format: coverImageType,
      }
    );

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
    const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "books",
      format: bookFileType,
    });

    // response
    console.log(coverImageUploadResult);
    console.log(bookUploadResult);
    res.json({ message: "Book registered successfully" });
  } catch (error) {
    console.log("Error while uploading files", error);
    return next(createHttpError(500, "Error while uploading files"));
  }
};

export { regiterBook };
