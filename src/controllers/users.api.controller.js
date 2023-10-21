import { UserModel } from "../DAO/mongo/models/users.api.model.js";
import { transport } from "../utils/nodemailer.js";
import { UserService } from "../services/users.api.services.js";

export const premiumUserMode = async (req, res) => {
  try {
    const id = req.params.uid;
    let user = await UserService.foundUser(id);
    if (!user) {
      return res.render("error", { msg: "Ese usuario no existe" });
    }

    const documentosSubidos = user.documents;
    const tieneIdentificacion = documentosSubidos.some(
      (documento) => documento.name === "Identificación"
    );
    const tieneComprobanteDomicilio = documentosSubidos.some(
      (documento) => documento.name === "Comprobante de domicilio"
    );
    const tieneComprobanteEstadoCuenta = documentosSubidos.some(
      (documento) => documento.name === "Comprobante de estado de cuenta"
    );
  
    if (
      !tieneIdentificacion ||
      !tieneComprobanteDomicilio ||
      !tieneComprobanteEstadoCuenta
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "El usuario debe subir todos los documentos necesarios antes de convertirse en premium.",
        data: null,
      });
    }
   
    if (user.rol === "user") {
      await UserService.updateRol(id, "premium");
    } else if (user.rol == "premium") {
       await UserService.updateRol(id, "user");
    } else {
      return res.status(400).json({
        status: "error",
        messgae: "Es admin, no puedes cambiar de rol usuario o premium",
        data: null,
      });
    }
    user = await UserService.foundUser(id);
    return res.status(200).json({
      status: "success",
      payload: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

export const uploadDocumentsPremium = async (req, res) => {
  try {
    const id = req.params.uid;
    const user = await UserService.foundUser(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const documents = [];

    for (const fieldName of Object.keys(req.files)) {
      const files = req.files[fieldName];
      for (const file of files) {
        let document;
        let reference;

        switch (fieldName) {
          case "identification":
            reference = "http://localhost:8080/documents/" + file.filename;
            document = {
              name: "Identificación",
              reference: reference,
            };
            break;
          case "check_address":
            reference = "http://localhost:8080/documents/" + file.filename;
            document = {
              name: "Comprobante de domicilio",
              reference: reference,
            };
            break;
          case "check_account":
            reference = "http://localhost:8080/documents/" + file.filename;
            document = {
              name: "Comprobante de estado de cuenta",
              reference: reference,
            };
            break;
          default:
            reference =
              "http://localhost:8080/" + fieldName + "/" + file.filename;
            document = {
              name: `${fieldName}`,
              reference: reference,
            };
            break;
        }

        documents.push(document);
      }
    }

    const updatedUser = await UserService.updateDocuments(id, documents);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ status: "success", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const premiumDocumentsLayer = async (req, res) => {
  let uid = req.params.uid;

  return res.render("user-documents-upload", { uid: uid });
};

export const getUsers = async (req, res) => {
  try {
    console.log("hola");
    const users = await UserService.getUsers();
    res.status(200).json({
      status: "success",
      message: "Users",
      data: users,
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: "Not found",
      data: [],
    });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const fechaActual = new Date();
    const fechaDiasAtras = fechaActual.setDate(fechaActual.getDate() - 2);
    const usersToDelete = await UserService.getUsers(fechaDiasAtras);
    await UserService.deleteUsers(fechaDiasAtras);
    usersToDelete.map(async (user) => {
      await transport.sendMail({
        from: "El lugar de las pizzas",
        to: `${user.email}`,
        subject: "Cambio de contraseña",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cuenta Eliminada</title>
            <style>
            body {
              font-family: "Poppins", sans-serif;
              font-size: 18px;
              color: #333;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
        
            .container {
              text-align: center;
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
        
            a {
              text-decoration: none;
              color: #333;
              font-weight: bold;
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
                <h1>Cuenta Eliminada</h1>
              </div>
              <div class="content">
                <p>Hola ${user.firstName},</p>
                <p>Lamentamos informarte que tu cuenta en El lugar de las pizzas ha sido eliminada debido a inactividad.</p>
             
                <p>Gracias por usar nuestro servicio.</p>
              </div>
              <div class="footer">
                <p>Este mensaje fue enviado desde El lugar de las pizzas.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    });

    res.status(200).json({
      status: "success",
      message: "Usuarios eliminados",
      data: usersToDelete,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor ",
      data: null,
    });
  }
};
