import mongoose from "mongoose";

interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  cardId: string;
  name: string;
  brand: string;
  shipping: string;
  quantity: number;
  price: number;
  images: {
    url: string;
    alt?: string;
  }[];
}
interface ICart extends mongoose.Document {
  owner: string;
  items: ICartItem[];
  bill: number;
  savedForLaterItems: ICartItem[];
}

declare module "express" {
  interface Request {
    user?: any; 
  }
}

export { ICartItem, ICart };
