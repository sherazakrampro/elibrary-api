import { User } from "./userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  coverImage: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
