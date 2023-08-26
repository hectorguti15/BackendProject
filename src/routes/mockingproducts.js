import express from "express"
import { productsFaker } from "../controllers/mockingproducts.controller.js";

export const mockingProducts = express.Router();


mockingProducts.get("/", productsFaker)