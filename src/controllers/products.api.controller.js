import { ProductsService } from "../services/products.api.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort } = req.query;
    const products = await ProductsService.getAllProducts(limit, page, sort);

    return res.status(200).json({
      status: "success",
      payload: products,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080/api/products?${
            limit ? `limit=${limit}` : ""
          }&page=${products.page - 1}${sort ? `&sort=${sort}` : ""}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080/api/products?${
            limit ? `limit=${limit}` : ""
          }&page=${products.page + 1}${sort ? `&sort=${sort}` : ""}`
        : null,
    });
  } catch (e) {
    req.logger.error(e)
    return res.status(500).json({
      status: "error",
      msg: "something went wrong",
      data: {},
    });
  }
};

export const getProduct = async (req, res) => {
  let id = req.params.pid;
  ProductsService.getProduct(id)
    .then((result) => {
      {
        res.status(200).json({
          status: "success",
          message: "Product found",
          data: result,
        });
      }
    })
    .catch((e) => {
      req.logger.error(e);
      res.status(404).json({
        status: "error",
        message: e.message,
        data: {},
      });
    });
};

export const createProduct = async (req, res) => {
  try {
    let product = req.body;
    if (req.file) {
      product.thumbnailURL = "http://localhost:8080/img/" + req.file.filename;
    }
    
    const productCreated = await ProductsService.createProduct(
      product.title || "",
      product.description || "",
      product.code || "",
      product.price || "",
      true,
      product.stock || "",
      product.thumbnailURL || "",
      req.session.rol == "premium" ? req.session.rol.email : "admin"
    );

    res.status(200).json({
      status: "success",
      message: "added product",
      data: productCreated,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const producToUpdate = req.body;
    const updateProduct = await ProductsService.updateProduct(
      id,
      producToUpdate
    );
    res.status(200).json({
      status: "success",
      message: "Product updated",
      data: updateProduct,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const id = req.params.pid;
    const owner = req.session.user.rol;
    const email = req.session.user.email;
    const deleteProduct = ProductsService.deleteProduct(id,owner=="premium" ? email : "admin");
    res.status(200).json({
      status: "success",
      message: "Product deleted",
      data: deleteProduct,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};
