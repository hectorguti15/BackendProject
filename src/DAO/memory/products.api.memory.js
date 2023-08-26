import fs from "fs";
import path from "path";
import { __dirname } from "../../dirname.js";

export class Products {
  #privatePath;
  constructor() {
    (this.#privatePath = path.join(
      __dirname,
      "./DAO/memory/FileSystem/products.json"
    )),
      (this.productsList = []);
  }
  #getId(list) {
    let id = 0;
    id = list.length;
    return ++id;
  }
  getAllProducts = async (limit, page, sortVerification) => {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      return this.productsList;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  getProducts = async () => {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      return this.productsList;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  getProduct = async (id) => {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      const product = this.productsList.find((product) => product.id == id);
      return product;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  createProduct = async (product) => {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      const newProduct = {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        status: product.status,
        stock: product.stock,
        thumbnails: product.thumbnails || "",
        id: this.#getId(this.productsList),
      };
      this.productsList.push(newProduct);
      await fs.promises.writeFile(
        this.#privatePath,
        JSON.stringify(this.productsList)
      );
      return newProduct;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  updateProduct = async (id, product) => {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      const indexProduct = this.productsList.findIndex(
        (product) => product.id == id
      );
      const updatedProduct = {
        ...this.productsList[indexProduct],
        ...product,
      };
      this.productsList[indexProduct] = updatedProduct;
      await fs.promises.writeFile(
        this.#privatePath,
        JSON.stringify(this.productsList)
      );
      return updatedProduct;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  async deleteProduct(id) {
    try {
      this.productsList = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      const deletedProduct = this.productsList.filter(
        (product) => product.id != id
      );
      this.productsList = deletedProduct;
      
      await fs.promises.writeFile(
        this.#privatePath,
        JSON.stringify(this.productsList)
      );
      return deletedProduct;
    } catch {
      req.logger.error(e.message);
    }
  }
}

