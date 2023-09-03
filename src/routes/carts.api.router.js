import express from "express";
import {
  changeProductsInCart,
  createCart,
  createPurchase,
  deleteProductCart,
  getCart,
  putProductInCart,
  updateProductQuantity,
} from "../controllers/carts.api.controller.js";
import { isUserOwner } from "../middlewares/auth.js";


export const cartsApiRouter = express.Router();
cartsApiRouter.get("/:cid", getCart);
cartsApiRouter.post("/", createCart);
cartsApiRouter.post("/:cid/product/:pid",isUserOwner,putProductInCart);
cartsApiRouter.delete("/:cid/products/:pid", deleteProductCart);
cartsApiRouter.put("/:cid", changeProductsInCart);
cartsApiRouter.put("/:cid/products/:pid", updateProductQuantity);
cartsApiRouter.delete("/:cid", deleteProductCart);
cartsApiRouter.get("/:cid/purcharse", createPurchase);
