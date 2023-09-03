import express from "express";

import { MailConfirmation, foundMailUser, mailChangePassword, mailChangePasswordValidated } from "../controllers/mail.controllers.js";
export const mailRouter = express.Router();

mailRouter.get("/", foundMailUser)
mailRouter.post("/", MailConfirmation);
mailRouter.get("/validation", mailChangePassword);
mailRouter.post("/validation", mailChangePasswordValidated);