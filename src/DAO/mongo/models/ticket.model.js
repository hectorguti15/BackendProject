import { Schema, model } from "mongoose";

const schema = new Schema({
  code: {
    type: String,
    max: 8,

    required: true,
  },
  purchase_datetime: {
    type: String,
    max: 100,

    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
});

export const TicketModel = model("ticket", schema);
