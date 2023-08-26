import fs from "fs";
import path from "path";
import { __dirname } from "../../dirname.js";


export class Carts {
  #privatePathCart;
  constructor() {
    this.#privatePathCart = path.join(__dirname, "./DAO/memory/FileSystem/carts.json");
    this.carts = [];
  }
  #getId(list) {
    let id = 0;
    id = list.length;
    return ++id;
  }
  getCarts = async () => {
    try {
      const carts = await JSON.parse(
        await fs.promises.readFile(this.#privatePathCart, "utf-8")
      );
      return carts;
    } catch (e) {
      req.logger.error(e.message)
    }
  };
  getCart = async (id) => {
    try {
      this.carts = JSON.parse(
        await fs.promises.readFile(this.#privatePathCart, "utf-8")
      );
      const cart = this.carts.find((cart) => cart.id == id);
      return cart;
    } catch (e) {
      req.logger.error(e.message)
    }
  };
  createCart = async () => {
    try {
      
      this.carts = await JSON.parse(
        await fs.promises.readFile(this.#privatePathCart, "utf-8")
      );
      
      let result = {
        products: [],
        id: this.#getId(this.carts),
      };
      this.carts.push(result);
      await fs.promises.writeFile(
        this.#privatePathCart,
        JSON.stringify(this.carts)
      );
      return result;
    } catch (e) {
      req.logger.error(e.message)
    }
  };
  updateCart = async (id, products) => {
    try {
      const cart = await this.getCart(id);
      cart.products = [...products];
      await fs.promises.writeFile(
        this.#privatePathCart,
        JSON.stringify(this.carts)
      );
      
      return cart;
    } catch (e) {
      req.logger.error(e.message)
    }
  };
}




