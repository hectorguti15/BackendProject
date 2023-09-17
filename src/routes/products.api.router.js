import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/products.api.controller.js";
import { uploader } from "../utils/multer.js";
import { checkAdminOrUserPremium } from "../middlewares/auth.js";
export const productsApiRouter = express.Router();


productsApiRouter.get("/", getAllProducts);
productsApiRouter.get("/:pid", getProduct);
//checkAdminOrUserPremium
productsApiRouter.post("/", uploader.single("thumbnails"), createProduct);
//checkAdminOrUserPremium
productsApiRouter.put("/:pid", updateProduct);
//checkAdminOrUserPremium
productsApiRouter.delete("/:pid", deleteProduct);
