import { Schema, Types } from "mongoose";
import { IUser } from "../../@types/user";
import { nameSchema } from "./name-schema";
import { imageSchema } from "./image-schema";
import { addressSchema } from "./address-schema";

const userSchema = new Schema<IUser>({
  name: nameSchema,
  address: {
    type: addressSchema,
    default: {
      city: "DefaultCity",
      state: "DefaultState",
      country: "DefaultCountry",
      street: "DefaultStreet",
      zip: "DefaultZip",
      houseNumber: 0,
    },
  },
  image: {
    type: imageSchema,
    required: false,
    default: {
      alt: "user-profile",
      url: "https://picsum.photos/200/300",
    },
  },
  phone: {
    required: true,
    type: String,
    minlength: 9,
    maxlength: 15,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    minlength: 7,
    maxlength: 255,
  },
  password: {
    required: true,
    type: String,
    minlength: 7,
    maxlength: 100,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  verificationCode: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  verificationTimeout: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpire: { type: Date, required: false },
});

export { userSchema };
