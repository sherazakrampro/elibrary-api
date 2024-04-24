import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

// Register a book controller
const regiterBook = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.files);
  // types of files for typescript
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  // get cover image type
  // by default 'image/jpeg' (split it by '/' and get the last element 'jpeg')
  const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);

  // get cover image file name
  const coverImageFileName = files.coverImage[0].filename;

  // get cover image file path
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );

  // upload cover image
  const coverImageUploadResult = await cloudinary.uploader.upload(
    coverImageFilePath,
    {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageType,
    }
  );

  // // get book file type
  // // by default 'application/pdf' (split it by '/' and get the last element 'pdf')
  const bookFileType = files.file[0].mimetype.split("/").at(-1);

  // get book file name
  const bookFileName = files.file[0].filename;

  // get book file path
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );

  // upload book file
  const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: "raw",
    filename_override: bookFileName,
    folder: "books",
    format: bookFileType,
  });

  console.log(coverImageUploadResult);
  console.log(bookUploadResult);

  res.json({ message: "Book registered successfully" });
};

export { regiterBook };
