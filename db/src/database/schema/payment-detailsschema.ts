import { Schema, model } from "mongoose";

const paymentDetailsSchema = new Schema({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  card_number: String,
  card_holder: String,
  expiry_date: String,
  cvv: String,
});

const PaymentDetails = model("PaymentDetails", paymentDetailsSchema);

export { PaymentDetails };
