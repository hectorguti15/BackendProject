import dotenv from "dotenv";

export const configDotenv = () => {
  const modo = process.argv[2];

  //Borrar este if si quieres siolo un enviroment
  if (modo !== "DEV" && modo !== "PROD") {
    console.log("Por favor, indique 'DEV' o 'PROD' como modo.");
    process.exit(1);
  }

  dotenv.config({
    path: modo === "DEV" ? "./.env.development" : "./.env.production",
  });

  return {
    MODE: modo,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    SECRET_PASSWORD: process.env.SECRET_PASSWORD,
    USER_MAILER: process.env.USER_MAILER,
  };
};