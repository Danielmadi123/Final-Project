import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  brand: string;
}

const categorySchema = new Schema<ICategory>(
  {
    brand: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
