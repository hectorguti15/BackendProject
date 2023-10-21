import { Server } from "socket.io";
import { __dirname } from "../dirname.js";
import { CartsService } from "../services/carts.api.service.js";
import { ProductsService } from "../services/products.api.service.js";
import { ChatServices } from "../services/messages.vista.service.js";

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (socket) => {
    //add products to cart
    try {
      const products = await ProductsService.getProducts();
      socket.emit("getProducts", products);

      const messages = await ChatServices.getMessages();
      socket.emit("getMessages", messages);
    } catch (e) {
      throw Error(e.message);
    }
    socket.on("addMessage", async (message) => {
      try {
        await ChatServices.addMessages(message);
        const result = await ChatServices.getMessages();
        socketServer.emit("getMessages", result);
      } catch (e) {
        req.logger.error(e.message)
      }
    });

    socket.on("addProduct", async (addProduct) => {
      try {
        await ProductsService.createProduct(
          addProduct.title,
          addProduct.description,
          addProduct.code,
          addProduct.price,
          true,
          addProduct.stock,
          addProduct.thumbnails
        );
        const products = await ProductsService.getProducts();
        socketServer.emit("getProducts", products);
      } catch (e) {
        throw Error(e.message);
      }
    });

    socket.on("addProductInCart", async (productId,cartId, owner) => {
      try {
        await CartsService.putProductInCart(productId, cartId, owner);
      } catch (e) {
        throw Error(e.message);
      }
    });
  });
}
