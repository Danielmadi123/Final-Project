import Joi from "joi";
import { ICard } from "../@types/card";

const schema = Joi.object<ICard>({
  title: Joi.string().min(1).max(100).required(),
  subtitle: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  brand: Joi.string().min(1).max(50).required(),
  price: Joi.number().required(),
  shipping: Joi.string().min(1).max(10).required(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().min(5).max(255),
      alt: Joi.string().min(1).max(100),
    })
  ),
});

export default schema;
export { schema as joiCardSchema };
