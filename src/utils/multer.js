import multer from "multer";
import path from "path";
import { __dirname } from "../dirname.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = "images";

    if (file.fieldname === "profile") {
      folderName = "profile";
    } else if (file.fieldname === "products") {
      folderName = "products";
    } else if (file.fieldname === "documents") {
      folderName = "documents";
    } else if (file.fieldname === "identification") {
      folderName = "documents";
    } else if (file.fieldname === "check_account") {
      folderName = "documents";
    } else if (file.fieldname === "check_address") {
      folderName = "documents";
    }

    const destinationPath = path.join(__dirname, "public", folderName);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
