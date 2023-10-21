import { CartsService } from "../services/carts.api.service.js";

export const getCart = async (req, res) => {
  try {
    const id = req.params.cid;
  
    const cart = await CartsService.getCart(id);
    res.status(200).json({
      status: "success",
      message: "Cart found",
      data: cart,
    });
  } catch (e) {
    res.status(404).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await CartsService.createCart();
    res.status(200).json({
      status: "success",
      message: "Cart created",
      data: cart,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const putProductInCart = async (req, res) => {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;
    const owner = req.session.user.email;
    const putProductInCart = await CartsService.putProductInCart(pid, cid,owner);
    res.status(200).json({
      status: "success",
      message: "product added",
      data: putProductInCart,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const deleteProductCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const owner = req.session.user.email;
    console.log( pid , cid , owner);
    const productDeleted = await CartsService.deleteProductCart(pid, cid,owner);
    res.status(200).json({
      status: "success",
      message: "Product deleted",
      data: productDeleted,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const changeProductsInCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updateProducts = req.body;
    const changeProductsInCart = await CartsService.changeProductsInCart(
      cid,
      updateProducts
    );
    res.status(200).json({
      status: "success",
      message: "The product list was changed correctly",
      data: changeProductsInCart,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productQuantity = req.body;
    const updateProductQuantity = await CartsService.updateProductQuantity(
      pid,
      cid,
      productQuantity
    );

    res.status(200).json({
      status: "success",
      message: "Product updated",
      data: updateProductQuantity,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const producstDeleted = await CartsService.deleteAllProducts(cid);
    res.status(200).json({
      status: "success",
      message: "Products deleted",
      data: producstDeleted,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};


export const createPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = req.session.email || req.session.user.email;
    const purchase = await CartsService.createPurchase(cid,user);
    res.status(200).json({
      status: "success",
      message: "Purchase",
      data: purchase,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: e.message,
      data: {},
    });
  }
};

