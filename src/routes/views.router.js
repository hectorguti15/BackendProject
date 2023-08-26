import express from "express";
import {
  LogOut,
  Login,
  PassportAuthLog,
  PassportAuthReg,
  Register,
} from "../controllers/views.controllers.js";
import passport from "passport";

export const viewsRouter = express.Router();

viewsRouter.get("/login", Login);
viewsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  PassportAuthLog
);
viewsRouter.get("/register", Register);
viewsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/register",
    failureFlash: true,
  }),
  PassportAuthReg
);
viewsRouter.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
viewsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/vista/productos");
  }
);
viewsRouter.get("/logout", LogOut);