import express from "express";


export const loggerRouter = express.Router();

loggerRouter.get("/",(req,res) =>{
    req.logger.error("Estamos probando los loggers: Error");
    req.logger.info("Estamos probando los loggers: Info");
    req.logger.warn("Estamos probando los loggers: Warn");
    req.logger.http("Estamos probando los loggers: Http");
    req.logger.debug("Estamos probando los loggers: debug")
    res.render("error",{msg: "Estamos probando los loggers"})
})