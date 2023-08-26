import winston from "winston";
import { configDotenv } from "./dotenv.js";

const config = configDotenv();

const customLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const loggerProd = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

const loggerDev = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (config.MODE = "PROD") {
    req.logger = loggerProd;
  } else {
    req.logger = loggerDev;
  }
  next();
};
