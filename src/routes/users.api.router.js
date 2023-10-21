import express from "express";
import { checkAdmin, checkUser, isUserAccountOwner } from "../middlewares/auth.js";
import { uploader } from "../utils/multer.js";

import {
  deleteUsers,
  getUsers,
  premiumDocumentsLayer,
  premiumUserMode,
  uploadDocumentsPremium,
} from "../controllers/users.api.controller.js";

export const apiUserRouter = express.Router();

apiUserRouter.get("/premium/:uid", checkAdmin, premiumUserMode);
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
  uploadDocumentsPremium
);
apiUserRouter.get("/:uid/documents", isUserAccountOwner, premiumDocumentsLayer);
apiUserRouter.get("/", checkAdmin, getUsers);
apiUserRouter.delete("/",checkAdmin, deleteUsers);
