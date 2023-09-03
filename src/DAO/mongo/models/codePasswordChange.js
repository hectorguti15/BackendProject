import { Schema, model } from "mongoose";

const codePasswordSchema = new Schema({
    code: {type: String, max: 30, required: true},
    expire: {type: String, required: true},
    email: {type: String, required: true}
});

export const codePasswordModel = model("codePassword", codePasswordSchema);