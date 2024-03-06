import { Document } from "mongoose";
import { IImage } from "./user";

interface ICardInput {
  title: string;
  subtitle: string;
  description: string;
  brand: string;
  price: number;
  shipping: string;
  address: IAddress;
  images: {
    url: string;
    alt?: string;
  }[];
}

interface ICard extends ICardInput, Document {
  bizNumber?: number;
  userId?: string;
  likes: string[];
  addToCart: string[];
  createdAt: Date;
}

export { ICardInput, ICard };
