import { configDotenv } from "./dotenv.js";
import nodemailer from "nodemailer";

const config = configDotenv();

export const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        port: config.PORT,
        auth: {
            user: `${config.USER_MAILER}`,
            pass: `${config.SECRET_PASSWORD}`
        }
    }
)