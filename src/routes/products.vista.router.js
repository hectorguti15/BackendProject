import express from "express";
import { getAllProducts } from "../controllers/products.vista.controller.js";

export const productsVistaRouter = express.Router();


productsVistaRouter.get("/", getAllProducts)