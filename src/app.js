//Import express
import express from "express";
import path from "path";
import FileStore from "session-file-store";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import passport from "passport";
import flash from "connect-flash";
import compression from "express-compression";

import { connectMongo } from "./utils/connectionMongo.js";
import { configDotenv } from "./utils/dotenv.js";
import { __dirname } from "./dirname.js";
import { viewsRouter } from "./routes/views.router.js";
import { initPassport } from "./config/passport.config.js";
import { productsVistaRouter } from "./routes/products.vista.router.js";
import { realTimeProductsRouter } from "./routes/realTimeProducts.router.js";
import { connectSocket } from "./utils/socket.js";
import { chatVistaRouter } from "./routes/chat.vista.router.js";
import { cartsVistaRouter } from "./routes/carts.vista.router.js";
import { cartsApiRouter } from "./routes/carts.api.router.js";
import { mailRouter } from "./routes/mail.router.js";
import errorHandler from "./middlewares/error.js";
import { mockingProducts } from "./routes/mockingproducts.js";
import { productsApiRouter } from "./routes/products.api.router.js";
import { loggerRouter } from "./routes/logger.router.js";
import { addLogger } from "./utils/logger.js";
import { UserModel } from "./DAO/mongo/models/users.api.model.js";
import { checkUser } from "./middlewares/auth.js";

const app = express();
const config = configDotenv();
const port = config.PORT;

console.log("Modo:", config.MODE);
console.log("Puerto:", config.PORT);
console.log("URL de MongoDB:", config.MONGO_URL);

//si quieres solo un enviroment
// console.log("Puerto:", config.PORT);
// console.log("URL de MongoDB:", config.MONGO_URL);

app.use(addLogger);

connectMongo(config.MONGO_URL);

const httpServer = app.listen(port, () => {
  console.log(`Customer connected on port ${port}`);
});
connectSocket(httpServer);

const FileStoreSession = FileStore(session);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://hectordeveloper15:lqnHD6HGFMMxI2d9@cluster-backend.smajxd2.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 86400 * 7,
    }),
    secret: "un-re-secreto",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initPassport();

app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

//public
app.use(express.static("./src/public"));
app.use("/images", express.static(path.join(__dirname, "public", "images")));

//Main EndPoint
app.use("/", viewsRouter);

//Products Endpoints
app.use("/vista/productos", productsVistaRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/api/products", productsApiRouter);

//Messages Endpoints
app.use("/vista/chat", chatVistaRouter);

//Carts Endpoints
app.use("/vista/carts", cartsVistaRouter);
app.use("/api/carts", cartsApiRouter);

//Mocking
app.use("/mockingproducts", mockingProducts);

//LoggerTest
app.use("/loggerTest", loggerRouter);

//Mail
app.use("/mail", mailRouter);

//Premium User
app.use("/api/users/premium/:uid",checkUser, async (req, res) => {
  let id = req.params.uid;
  let user = req.session.user;
  if (req.session.user.rol == "user") {
    req.session.user.rol = "premium";
    await req.session.save();
    await UserModel.updateOne({ id: id, rol: "premium" });
  } else {
    req.session.user.rol = "user";
    await req.session.save();
    await UserModel.updateOne({ id: id, rol: "user" });
  }
  res.status(200).json({
    status:"success",
    playload: user,
  })
});

//Session
app.use("/sessions/current", (req, res) => {
  let user = req.session.user;
  return res.status(200).json({
    status: "success",
    msg: "datos de la session",
    payload: user,
  });
});
//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("*", (req, res) => {
  res.render("error", { msg: "Página no encontrada" });
});

app.use(errorHandler);
