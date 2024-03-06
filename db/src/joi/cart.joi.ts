import Joi from "joi";
import mongoose from "mongoose";
import { ICartItem, ICart } from "../@types/cart";

const { ObjectId } = mongoose.Types;

const cartItemSchema = Joi.object({
  cardId: Joi.string().required(),
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().required(),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        alt: Joi.string(),
      })
    )
    .required(),
  brand: Joi.string().required(),
  shipping: Joi.string().required(),
});

const cartSchema = Joi.object({
  _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  owner: Joi.string().required(),
  items: Joi.array().items(cartItemSchema).required(),
  bill: Joi.number().required(),
  savedForLaterItems: Joi.array().items(cartItemSchema).required(),
});

export { ICartItem, ICart, cartSchema, ObjectId };
