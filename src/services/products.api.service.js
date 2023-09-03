import ProductsDto from "../DAO/DTO/products.api.dto.js";

//Use memory:
//import { Products } from "../DAO/memory/products.api.memory.js";

//Use mongo:
import Products from "../DAO/mongo/products.api.mongo.js";
import { generateProductInfo } from "./errors/info.js";
import CustomError from "./errors/custom-error.js";
import EErros from "./errors/enum.js";

class productsService {
  constructor(dao) {
    this.dao = dao;
  }
  validateProduct(title, description, code, price, status, stock) {
    if (!title || !description || !code || !price || !status || !stock) {
      const product = { title, description, code, price, status, stock };
      CustomError.createError({
        name: "Message creation error",
        cause: generateProductInfo(product),
        message: "Error trying to create a product",
        code: EErros.INVALID_TYPES_ERROR,
      });
    }
  }
  validatePutProduct(id, productToUpdate) {
    const validation = Object.values(productToUpdate).some(
      (value) => value === null || value === undefined || value === ""
    );
    if (!validation && !id) {
      CustomError.createError({
        name: "Update product",
        cause: "Validate product id or verify all the fields are completed",
        message: "Error trying to update a product",
        code: EErros.INVALID_TYPES_ERROR,
      });
    }
  }
  validateProductId(id) {
    try {
      if (!id) {
        CustomError.createError({
          name: "Product doesnt exist",
          cause: "Validate product id ",
          message: "Error trying to update a product",
          code: EErros.INVALID_TYPES_ERROR,
        });
      }
    } catch (e) {
      throw e.message;
    }
  }
  async getAllProducts(limit, page, sort) {
    try {
      const sortVerification = sort ? (sort === "asc" ? 1 : -1) : 1;
      const products = await this.dao.getAllProducts(
        limit,
        page,
        sortVerification
      );

      return products;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getProducts() {
    try {
      const products = await this.dao.getProducts();
      return products;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getProduct(id) {
    try {
      const product = await this.dao.getProduct(id);
      return product;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async createProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    thumbnails,
    owner
  ) {
    try {
      this.validateProduct(title, description, code, price, status, stock);
      const products = new ProductsDto({
        title,
        description,
        code,
        price,
        status,
        stock,
        thumbnails,
        owner,
      });
      const productCreated = await this.dao.createProduct(products);
      return productCreated;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async updateProduct(id, productToUpdate) {
    try {
      this.validatePutProduct(id, productToUpdate);
      const updateProduct = await this.dao.updateProduct(id, productToUpdate);
      return updateProduct;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async deleteProduct(id, owner) {
    try {
      if (owner == "admin") {
        this.validateProductId(id);
        const deletedProduct = await this.dao.deleteProduct(id);
        return deletedProduct;
      } else {
        this.validateProductId(id);
        let product = await this.getProduct(id);
        if (product.owner == owner) {
          const deletedProduct = await this.dao.deleteProduct(id);
          return deletedProduct;
        } else {
          throw new Error("No puedes borrar un producto que no has creado");
        }
      }
    } catch {
      throw new Error(e.message);
    }
  }
}

export const ProductsService = new productsService(new Products());
