import mongoose, { Schema, Document } from "mongoose";
import { ICartItem, ICart } from "../../@types/cart"; 
const cartSchema: Schema<ICart> = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    owner: {
      type: String,
      required: true,
      ref: "User",
    },
    items: [
      {
        cardId: {
          type: Schema.Types.ObjectId,
          ref: "Card", 
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        images: [
          {
            url: {
              type: String,
              required: true,
            },
            alt: {
              type: String,
            },
          },
        ],
        brand: {
          type: String,
          required: true,
        },
        shipping: {
          type: String,
          required: true,
        },
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    savedForLaterItems: [

      {
        cardId: {
          type: Schema.Types.ObjectId,
          ref: "Card",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        images: [
          {
            url: {
              type: String,
              required: true,
            },
            alt: {
              type: String,
            },
          },
        ],
        brand: {
          type: String,
          required: true,
        },
        shipping: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);

export default CartModel;
