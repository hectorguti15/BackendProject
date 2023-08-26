import { ProductsModel } from "./models/products.api.model.js";

export default class Products {
  constructor() {}
  getAllProducts = async (limit, page, sortVerification) => {
    try {
      const products = await ProductsModel.paginate(
        {},
        {
          limit: limit || 10,
          page: page || 1,
          sort: { price: sortVerification },
        }
      );
      return products;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  getProducts = async () => {
    try {
      const products = await ProductsModel.find({});
      return products;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  getProduct = async (id) => {
    try {
      const products = await ProductsModel.find({ _id: id });
      return products;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  createProduct = async (product) => {
    try {
      const result = await ProductsModel.create(product);
      return result;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  updateProduct = async (id, product) => {
    try {
      const result = await ProductsModel.updateOne(
        { _id: id },
        product,
        { new: true }
      );

      return result;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductsModel.deleteOne({ _id: id });
      return deletedProduct;
    } catch {
      req.logger.error(e.message);
    }
  }
}
