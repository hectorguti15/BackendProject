import { CartsModel } from "./models/carts.api.model.js";


export default class Carts {
  constructor() {}
  getCarts = async () => {
    try {
      const carts = await CartsModel.find();
      return carts;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  getCart = async (id) => {
    try {
      const cart = await CartsModel.findOne({ _id: id }).populate('products.product');
      return cart;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  createCart = async () => {
    try {
      const result = await CartsModel.create({products: []});
      return result;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  updateCart = async (id, products) => {
    try {
      const result = await CartsModel.findByIdAndUpdate(
        id,
        { products: products },
        { new: true }
      );

      return result;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  deleteCart = async(cid) =>{
    try{
      const result = await CartsModel.deleteOne(cid);
      return result;
    }
    catch(e){
      req.logger.error(e.message);
    }
  }
}
