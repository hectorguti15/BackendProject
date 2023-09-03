import { codePasswordModel } from "../DAO/mongo/models/codePasswordChange.js";
import { UserModel } from "../DAO/mongo/models/users.api.model.js";
import { UserService } from "../services/users.api.services.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { transport } from "../utils/nodemailer.js";
import { generateSecureRandomCode } from "../utils/randomGenerateCode.js";

export const foundMailUser = async (req, res, email) => {
  res.render("cambio-contraseña-question");
};

export const MailConfirmation = async (req, res) => {
  try {
    const email = req.body.email;

    let user = await UserService.existUser(email);
    const expirationTime = new Date().getTime() + 60 * 60 * 1000;

    const passwordCode = await codePasswordModel.create({
      email: user.email,
      expire: expirationTime,
      code: generateSecureRandomCode(15),
    });

    await transport.sendMail({
      from: "El lugar de las pizzas",
      //   to: `${user.email}`,
      to: "abcdefgutierrez1234@gmail.com",
      subject: "Cambio de contraseña",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cambio de contraseña</title>
        <style>
        body {
            font-family: "Poppins", sans-serif;
            font-size: 16px;
            color: #333;
          }
      
          h1 {
            font-size: 20px;
            font-weight: bold;
            margin-top: 0;
          }
      
          p {
            margin-bottom: 10px;
          }
      
          a {
            text-decoration: none;
            color: #000;
          }
      
          .reset-password {
            background-color: #000;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cambio de contraseña</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Has solicitado un cambio de contraseña en El lugar de las pizzas. Por favor, sigue el enlace a continuación para completar el proceso:</p>
            <p><a href="http://localhost:8080/mail/validation?email=${user.email}&code=${passwordCode.code}">Cambiar contraseña</a></p>
            <p>Si no solicitaste este cambio, ignora este correo electrónico.</p>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde El lugar de las pizzas.</p>
          </div>
        </div>
      </body>
      </html>
    `,
      attachments: [],
    });
    res.render("email-confirmation");
  } catch (e) {
    res.render("error", { msg: "Ingrese nuevamente su email" });
  }
};

export const mailChangePassword = async (req, res) => {
  try {
    res.render("change-password", {
      email: req.query.email,
      code: req.query.code,
    });
  } catch (e) {
    throw e;
  }
};
export const mailChangePasswordValidated = async (req, res) => {
  try {
    const { email, code } = req.query;
    const password = req.body.password;

    const result = await codePasswordModel.findOne({ code: code });
    const user = await UserModel.findOne({ email: email });
    console.log(result.code,result.expire, new Date().getTime())
    if(result.expire > new Date().getTime()){
      ;
      if(email == result.email){
        if(isValidPassword(password,user.password)){
          res.render("change-password", {msg: "La contraseña no puede ser como la anterior", email: email, code:code});
        }
      }
      else{
        res.render("error", {msg: "Algo salio mal"});
      }
      let userUpdated = await UserModel.updateOne({email: email, password: createHash(password)});
      console.log(userUpdated);
      res.render("login");
    }
    else{
      res.render("error", {msg: "El código ha expirado"})
    }
    
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
};
