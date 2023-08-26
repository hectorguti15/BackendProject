import mongoosePaginate from "mongoose-paginate-v2"
import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    title: {type: String, required: true, max:100},
    description: {type:String , required: true, max:300},
    code: {type: String, required: true, max:6},
    price: {type: Number, required: true},
    status: {type: Boolean, required: true},
    stock: {type: Number, required: true},
    thumbnails: {type: String, required: false}
});

productsSchema.plugin(mongoosePaginate);

export const ProductsModel = model("products", productsSchema);