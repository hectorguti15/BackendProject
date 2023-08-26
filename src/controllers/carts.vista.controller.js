import { CartsService } from "../services/carts.api.service.js";

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartsService.getCart(cid);
    let products = cart.products.map((product) => {
      return {
        product: {
          title: product.product.title,
          description: product.product.description,
          code: product.product.code,
          price: product.product.price,
          status: product.product.status,
          thumbnails: product.product.thumbnails,
        },
        quantity: product.quantity,
      };
    });
    return res.render("cart", { cart: cart, productos: products });
    if (products.lenght > 0) {
      return res.render("cart", { cart: cart, productos: products });
    } else {
      return res.render("error", { msg: "No existe productos en el carrito" });
    }
  } catch (e) {
    req.logger.error(e.message)
  }
};
