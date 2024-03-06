import { Schema } from "mongoose";
import { ICard } from "../@types/card";
import { imageSchema } from "../database/schema/image-schema";

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  shipping: { type: String, required: true },
  images: { type: [imageSchema], required: false },
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    unique: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  likes: [
    {
      type: String,
    },
  ],
  addToCart: [
    {
      type: String,
    },
  ],
});

export { cardSchema as joiCardSchema };
