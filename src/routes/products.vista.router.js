import express from "express";
import { getAllProducts } from "../controllers/products.vista.controller.js";
import { checkUser } from "../middlewares/auth.js";

export const productsVistaRouter = express.Router();


productsVistaRouter.get("/",checkUser, getAllProducts)