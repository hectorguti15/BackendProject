import { ProductsService } from "../services/products.api.service.js";
import { transport } from "../utils/nodemailer.js";

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
    req.logger.error(e);
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
      product.thumbnailURL = "http://localhost:8080/images/" + req.file.filename;
    }
   

    const productCreated = await ProductsService.createProduct(
      product.title || "",
      product.description || "",
      product.code || "",
      product.price || "",
      true,
      product.stock || "",
      product.thumbnailURL || "",
      req.session.user.rol == "premium" ? req.session.user.email : "admin"
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

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const owner = req.session.user.rol;
    const email = req.session.user.email;
    const deleteProduct = await ProductsService.deleteProduct(id, owner);
    if (owner == "premium") {
      await transport.sendMail({
        from: "El lugar de las pizzas",
        to: `${email}`,
        subject: "Cambio de contraseña",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Producto Eliminado</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
              text-align: center;
            }
  
            .container {
              background-color: #fff;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
  
            h1 {
              font-size: 24px;
              font-weight: bold;
              margin: 0;
              color: #333;
            }
  
            p {
              margin-bottom: 20px;
            }
  
            .header {
              background-color: #ff1744;
              color: #fff;
              padding: 10px;
              border-radius: 10px 10px 0 0;
            }
  
            .content {
              padding: 20px;
            }
  
            .footer {
              background-color: #333;
              color: #fff;
              padding: 10px;
              border-radius: 0 0 10px 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Producto Eliminado</h1>
            </div>
            <div class="content">
              <p>Hola ${email},</p>
              <p>Lamentamos informarte que tu producto en El lugar de las pizzas ha sido eliminado.</p>
              <p>Gracias por utilizar nuestros servicios.</p>
            </div>
            <div class="footer">
              <p>Este mensaje fue enviado desde El lugar de las pizzas.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      });
    }
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
