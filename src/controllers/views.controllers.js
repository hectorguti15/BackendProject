export const Login = (req, res) => {                                                                          
  res.render("login", { message: req.flash("loginError") });
};

export const PassportAuthLog = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ error: "Algo salio mal :(, intentalo nuevamente" });
    }
  
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      cartId: req.user.cartId,
      rol: req.user.rol,
    };
    
    await req.session.save();

    return res.status(200).json(
      {
        status: "success",
        message: "Usuario logeado",
        playload: req.user
      }
    )
    // return res.redirect("/vista/productos");
  } catch (e) {
    throw Error(e);
  }
};

export const Register = (req, res) => {
  res.render("register", { message: req.flash("registerError") });
};

export const PassportAuthReg = async (req, res) => {
  if (!req.user) {
    return res.json({ error: "Algo salio mal :(, intentalo nuevamente" });
  }
  
  req.session.user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    cartId: req.user.cartId,
    rol: req.user.rol,
  };
 
  await req.session.save();
  return res.status(200).json(
    {
      status: "success",
      message: "Usuario registrado",
      playload: req.user
    }
  )
  // return res.redirect("/vista/productos");
};


export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render("error", { msg: "no se pudo cerrar la session" });
    }
    return res.redirect("/login");
  });
};