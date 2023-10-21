import express from "express";
import { realTimeProducts } from "../controllers/realTimeProducts.controller.js";
import { checkUser } from "../middlewares/auth.js";


export const realTimeProductsRouter = express.Router();
realTimeProductsRouter.get("/", checkUser, realTimeProducts);
