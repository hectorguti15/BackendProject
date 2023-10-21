import { ProductsService } from "../services/products.api.service.js";

export const getAllProducts = async (req, res) => {
    try {
      const firstName = await req.session.user.firstName
      const email = await req.session.user.email
      const cartId = await req.session.user.cartId;

      const { limit, page, sort } = req.query;   
      const productsList = await ProductsService.getAllProducts(limit, page , sort);

      const owner = req.session.user.rol;
      
      let products = productsList.docs.map((product) => {
        return {
          id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnails: product.thumbnails,
        };
      });
      return res.render("products", {
        products: products,
        pagingCounter: productsList.pagingCounter,
        totalPages: productsList.totalPages,
        page: productsList.page,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        userName: firstName,
        userEmail: email,
        limit: limit,
        sort: sort,
        cartId: cartId,
        owner: owner
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: e.message,
        data: {},
      });
    }
  }