import { Document, Schema, model, Types } from "mongoose";

interface IToken extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user", 
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, 
  },
});

export default model<IToken>("Token", tokenSchema);
