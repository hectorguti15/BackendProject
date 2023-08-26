import { Schema, model } from "mongoose";

export const ChatModel = model("messages", new Schema({
    user: {type: String, max: 30, required: true},
    message: {type: String, required: true}
}))