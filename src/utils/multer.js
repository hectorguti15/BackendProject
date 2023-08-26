import multer from "multer";
import path from "path";
import { __dirname } from "../dirname.js";

const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null, path.join(__dirname ,"public","images"));

  },
  filename: (req,file,cb) =>{
    cb(null, file.originalname) 
  }
})

export const uploader =  multer({storage})