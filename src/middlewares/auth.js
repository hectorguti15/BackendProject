export function checkUser(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).render("error", { msg: "Logeate correctamente" });
}

export function checkAdminOrUserPremium(req, res, next) {
  if (req.session.user.email && (req.session.user.rol == "admin" || req.session.user.rol == "premium")) {
    return next();
  }
  return res.status(401).render("error", { msg: "Ingresa como administrador o paga para ser premium" });
}

export function isUserOwner(req, res, next) {
  if (req.session?.user) {
    const currentUserCartId = req.session.user.cartId;

    if (currentUserCartId === req.params.cid) {
      next();
    } else {
      return res.status(403).render("error", {
        msg: "No tienes permiso para acceder a este carrito.",
      });
    }
  } else {
    return res.status(401).render("error", {
      msg: "Debes iniciar sesión para acceder a esta funcionalidad.",
    });
  }
}

export function isUserNotAdmin(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).render("error", { msg: "Ingresa como usuario" });
}
