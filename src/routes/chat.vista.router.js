import express from "express";
import { getChat } from "../controllers/chat.vista.controller.js";

export const chatVistaRouter = express.Router();

chatVistaRouter.get("/", getChat)