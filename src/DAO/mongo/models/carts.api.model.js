import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  cart: { type: String, required: false },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: {type:Number , default: 1}
      },
    ],
    default: [],
  },
});

export const CartsModel = model("carts", cartSchema);