import CartsDto from "../DAO/DTO/carts.api.dto.js";
//Use memory:
//import { Carts } from "../DAO/memory/cart.api.memory.js";

//Use mongo:
import Carts from "../DAO/mongo/carts.api.mongo.js";

import { TicketModel } from "../DAO/mongo/models/ticket.model.js";
import { ProductsService } from "./products.api.service.js";
import CustomError from "./errors/custom-error.js";
import EErros from "./errors/enum.js";

class cartsService {
  constructor(dao) {
    this.dao = dao;
  }
  async validateCartId(id) {
    try {
      const carts = await this.getAllCarts();
      const validation = carts.some((cart) => cart._id == id);
      if (!validation && !id) {
        CustomError.createError({
          name: "User creation error",
          cause: generateUserErrorInfo(user),
          message: "Error trying to create user",
          code: EErros.INVALID_TYPES_ERROR,
        });
      }
    } catch (e) {
      throw e;
    }
  }
  async validateProductInCart(pid, cid, owner) {
    try {
      const products = await ProductsService.getProducts();
      
      const carts = await this.getAllCarts();
      const productValidation = products.some((product) => product._id == pid);
      if (!productValidation) {
        CustomError.createError({
          name: "Product doesnt exist",
          cause:"Intentas poner un producto inexistente",
          message: "Error trying to validate a product",
          code: EErros.INVALID_TYPES_ERROR,
        });
      } else {
       
        if (productValidation.owner == owner) {
          CustomError.createError({
            name: "Product doesnt exist",
            cause: "No puedes agregar productos creados por ti",
            message: "Error trying to validate a product",
            code: EErros.INVALID_TYPES_ERROR,
          });
        } else {
         
          //Base de datos
          const cartValidation = carts.some((cart) => cart._id == cid);
          
          //Memory
          //const cartValidation = carts.some((cart) => cart.id == cid);
          if (!cartValidation) {
            CustomError.createError({
              name: "Cart doesnt exist",
              cause: "Intentas poner un carrito inexistente",
              message: "Error trying to valdiate a cart",
              code: EErros.INVALID_TYPES_ERROR,
            });
          }
      
        }
      }
     
    } catch (e) {
      throw e.message;
    }
  }
  async getAllCarts() {
    try {
      const carts = await this.dao.getCarts();
      return carts;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async getCart(id) {
    try {
      const cart = await this.dao.getCart(id);
      return cart;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async createCart() {
    try {
      const result = await this.dao.createCart();
      return result;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async putProductInCart(pid, cid, owner) {
    try {
      await this.validateProductInCart(pid, cid, owner);
      const cart = await this.getCart(cid);
      const productIndex = cart.products.findIndex(
        (product) => product.product._id == pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;

        const productsCart = new CartsDto(cart);

        const infoCart = await this.dao.updateCart(cid, productsCart.products);

        return infoCart;
      } else {
        cart.products.push({
          product: pid,
          quantity: 1,
        });
        const productsCart = new CartsDto(cart);

        const infoCart = await this.dao.updateCart(cid, productsCart.products);

        return infoCart;
      }
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async deleteProductCart(pid, cid, owner) {
    try {
      await this.validateProductInCart(pid, cid,owner);
      console.log("que chucha pasa aca");
      const cart = await this.getCart(cid);
      cart.products = cart.products.filter((product) => product.product != pid);
      const productsCart = new CartsDto(cart);
      const productDeleted = await this.dao.updateCart(
        cid,
        productsCart.products
      );
      return productDeleted;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async changeProductsInCart(cid, updateProducts) {
    //para aplicar esto debes confirmar que en el array que se esta pasando de update products que los productos existan
    try {
      await this.validateCartId(cid);
      const changedCart = await this.dao.updateCart(cid, updateProducts);
      return changedCart;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async updateProductQuantity(pid, cid, productQuantity) {
    //un objeto para que funcione correctamente
    try {
      await this.validateProductInCart(pid, cid);
      const cart = await this.getCart(cid);
      cart.products.map((product) => {
        if (product.product == pid) {
          product.quantity = productQuantity.quantity;
        }
      });
      const productsCart = new CartsDto(cart);
      const updatedProduct = await this.dao.updateCart(
        cid,
        productsCart.products
      );
      return updatedProduct;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async deleteAllProducts(cid) {
    try {
      await this.validateCartId(cid);
      const cart = await this.getCart(cid);
      cart.products = [];
      const productsCart = new CartsDto(cart);
      const productsDeleted = await this.dao.updateCart(
        cid,
        productsCart.products
      );
      return productsDeleted;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  async createPurchase(cid, user) {
    try {
      const cart = await this.getCart(cid);
      let existleftProducts = false;
      const newCart = [];
      let amount = 0;
      for (let product of cart.products) {
        const quantity = product.quantity;
        const idProduct = product.product._id;
        const newStock = product.product.stock - quantity;
        if (newStock >= 0) {
          await ProductsService.updateProduct(idProduct, {
            stock: `${newStock}`,
          });
          const amountProduct = quantity * product.product.price;
          amount = amount + amountProduct;
        } else {
          const missingQuantity = quantity - product.product.stock;
          const productmissing = {
            product: idProduct,
            quantity: missingQuantity,
          };
          newCart.push(productmissing);

          const amountProduct = product.product.stock * product.product.price;
          amount = amount + amountProduct;
          existleftProducts = true;
          await ProductsService.updateProduct(idProduct, {
            stock: 0,
          });
        }
      }
      if (existleftProducts) {
        const newTicket = {
          code: this.generateRandomCode(8),
          purchase_datetime: Date.now(),
          amount: amount,
          purchaser: user,
        };
        await TicketModel.create(newTicket);
        const missingProductsCarts = this.changeProductsInCart(cid, newCart);

        return missingProductsCarts;
      } else {
        const newTicket = {
          code: this.generateRandomCode(8),
          purchase_datetime: Date.now(),
          amount: amount,
          purchaser: user,
        };
        const ticket = await TicketModel.create(newTicket);
        await this.dao.deleteCart();
        return ticket;
      }
    } catch (e) {
      req.logger.error(e.message);
    }
  }
  generateRandomCode(longitud) {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let codigoRandom = "";
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigoRandom += caracteres.charAt(indice);
    }
    return codigoRandom;
  }
}

export const CartsService = new cartsService(new Carts());
