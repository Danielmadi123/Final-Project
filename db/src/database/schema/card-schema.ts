import { Schema, Document } from "mongoose";
import { ICard } from "../../@types/card";
import { imageSchema } from "./image-schema";

async function addDollarSign(this: ICard & Document, next: () => void) {
  console.log("Middleware addDollarSign is called");

  console.log("Original price:", this.price);
  console.log("Original shipping:", this.shipping);




  if (this.shipping !== undefined && !isNaN(Number(this.shipping))) {
    this.shipping = `$${Number(this.shipping).toFixed(2)}`;
  }

  console.log("Formatted price:", this.price);
  console.log("Formatted shipping:", this.shipping);

  next();
}

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  shipping: { type: String, required: true },
  images: [{ type: imageSchema }],
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

cardSchema.pre("save", addDollarSign);

export { cardSchema };
