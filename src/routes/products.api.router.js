import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/products.api.controller.js";
import { uploader } from "../utils/multer.js";
import { checkAdmin } from "../middlewares/auth.js";
export const productsApiRouter = express.Router();


productsApiRouter.get("/", getAllProducts);
productsApiRouter.get("/:pid", getProduct);
productsApiRouter.post("/",checkAdmin, uploader.single("thumbnails"), createProduct);
productsApiRouter.put("/:pid",checkAdmin, updateProduct);
productsApiRouter.delete("/:pid",checkAdmin, deleteProduct);
