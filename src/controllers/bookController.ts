import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import BookModel from "../models/bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

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

  // create new book
  const _req = req as AuthRequest;
  let newBook;
  try {
    newBook = await BookModel.create({
      title,
      genre,
      author: _req.userId,
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

// Update a book controller
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const { title, genre } = req.body;

  // check if book exists
  const book = await BookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // check if user is author of the book
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "unauthorized"));
  }

  // types of files for typescript
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  let completeCoverImageName = "";
  // check if cover image is uploaded
  if (files.coverImage) {
    const coverImageFileName = files.coverImage[0].filename;
    const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);

    // get cover image file path
    const coverImageFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      coverImageFileName
    );

    completeCoverImageName = coverImageFileName;

    // upload
    let coverImageUploadResult;
    try {
      coverImageUploadResult = await cloudinary.uploader.upload(
        coverImageFilePath,
        {
          filename_override: completeCoverImageName,
          folder: "book-covers",
          format: coverImageType,
        }
      );
      completeCoverImageName = coverImageUploadResult.secure_url;

      // delete temp file
      try {
        await fs.promises.unlink(coverImageFilePath);
      } catch (error) {
        console.log("failed to delete temp files", error);
        return next(createHttpError(500, "failed to delete temp files"));
      }
    } catch (error) {
      console.log("failed to upload cover image", error);
      return next(createHttpError(500, "failed to upload cover image"));
    }
  }

  let completeBookFileName = "";
  // check if book file is uploaded
  if (files.file) {
    const bookFileName = files.file[0].filename;
    const bookFileType = files.file[0].mimetype.split("/").at(-1);

    // get book file path
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    completeBookFileName = bookFileName;

    // upload
    let bookFileUploadResult;
    try {
      bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeBookFileName,
        folder: "books",
        format: bookFileType,
      });
      completeBookFileName = bookFileUploadResult.secure_url;
    } catch (error) {
      console.log("failed to upload book file", error);
      return next(createHttpError(500, "failed to upload book file"));
    }

    // delete temp file
    try {
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      console.log("failed to delete temp files", error);
      return next(createHttpError(500, "failed to delete temp files"));
    }
  }

  // update book
  try {
    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      {
        title,
        genre,
        coverImage: completeCoverImageName
          ? completeCoverImageName
          : book.coverImage,
        file: completeBookFileName ? completeBookFileName : book.file,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Book updated successfully", data: updatedBook });
  } catch (error) {
    console.log("failed to update book", error);
    return next(createHttpError(500, "failed to update book"));
  }
};

// get all books
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBooks = await BookModel.find();
    res.status(200).json(allBooks);
  } catch (error) {
    console.log("error while listing books", error);
    return next(createHttpError(500, "error while listing books"));
  }
};

// get a single book
const singleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  try {
    const book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    res.status(200).json(book);
  } catch (error) {
    console.log("error while getting a book", error);
    return next(createHttpError(500, "error while getting a book"));
  }
};

export { regiterBook, updateBook, listBooks, singleBook };
