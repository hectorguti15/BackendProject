import express from "express";
import { checkUser } from "../middlewares/auth.js";
import { UserModel } from "../DAO/mongo/models/users.api.model.js";
import { uploader } from "../utils/multer.js";

export const apiUserRouter = express.Router();

apiUserRouter.get("/premium/:uid", checkUser, async (req, res) => {
  try {
    const id = req.params.uid;
    const user = await UserModel.find({ _id: id });
    if (!user) {
      res.render("error", { msg: "Ese usuario no existe" });
    }

    const documentosSubidos = user[0].documents;
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
      });
    }

    if (user.rol === "user") {
      user.rol = "premium";
      await req.session.save();
      await UserModel.updateOne({ _id: id }, { rol: "premium" });
    } else {
      user.rol = "user";
      await req.session.save();
      await UserModel.updateOne({ _id: id }, { rol: "user" });
    }

    res.status(200).json({
      status: "success",
      payload: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

apiUserRouter.post(
  "/:uid/documents",
  checkUser,
  uploader.fields([
    { name: "profile" },
    { name: "products" },
    { name: "identification" },
    { name: "check_account" },
    { name: "check_address" },
    { name: "documents" },
  ]),
  async (req, res) => {
    try {
      const id = req.params.uid;
      const user = await UserModel.findById(id);

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

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $push: { documents: { $each: documents } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ status: "success", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

apiUserRouter.get("/:uid/documents", checkUser, async (req, res) => {
  let uid = req.params.uid;

  return res.render("user-documents-upload", { uid: uid });
});
