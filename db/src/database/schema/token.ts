import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  userId: string;
  token: string;
  verificationCode: string;
  createdAt: Date;
  expiresAt: Date; 
}

const TokenSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {

    type: Date,
    default: () => new Date(+new Date() + 3600 * 1000),
    required: true,
  }, 
});



export const Token = mongoose.model<IToken>("Token", TokenSchema);
