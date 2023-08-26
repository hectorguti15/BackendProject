import express from "express";
import { realTimeProducts } from "../controllers/realTimeProducts.controller.js";


export const realTimeProductsRouter = express.Router();
realTimeProductsRouter.get("/", realTimeProducts);
