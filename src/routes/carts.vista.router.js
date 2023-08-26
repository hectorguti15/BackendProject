import express from "express";
import { getCart } from "../controllers/carts.vista.controller.js";


export const cartsVistaRouter = express.Router();

cartsVistaRouter.get("/:cid", getCart);
