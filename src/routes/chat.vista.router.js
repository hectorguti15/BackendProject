import express from "express";
import { getChat } from "../controllers/chat.vista.controller.js";
import { checkUser } from "../middlewares/auth.js";

export const chatVistaRouter = express.Router();

chatVistaRouter.get("/",checkUser, getChat)