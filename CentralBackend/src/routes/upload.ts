import path from "path";
import express from "express";
import { z } from "zod";
import db from "../database";
import { addFiltration } from "../helper/addFiltration";
import { paginatedResults } from "../helper/paginatedResults";
import multer, { MulterError } from "multer";

const maxSize = 8388608; // Max 8MB
const maxFiles = 8;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload/image");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { files: maxFiles, fileSize: maxSize },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { files: 1, fileSize: maxSize },
});

const uploadRouter = express.Router();
const uploadArray = upload.array("items", 8);
const imageSingle = imageUpload.single("image");

uploadRouter.post("/", (req, res) => {
  uploadArray(req, res, (err) => {
    if (err instanceof MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "An unknown error occured!" });
    }

    return res
      .status(201)
      .json({ message: "Successfully uploaded files", files: req.files });
  });
});

uploadRouter.post("/image", (req, res) => {
  imageSingle(req, res, (err) => {
    if (err instanceof MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "An unknown error occured!" });
    }

    return res
      .status(201)
      .json({ message: "Image uploaded successfully", image: req.file });
  });
});

export default uploadRouter;
