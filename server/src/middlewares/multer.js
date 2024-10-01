import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { maxFileSize } from "../lib/helpers.js";
import handleMulterError from "../utils/MulterErrorHandler.js";

const multerUpload = multer({
  limits: {
    fieldSize: maxFileSize, // Max size: 10mb,
  },
});

export const singleFile = (req, res, next) => {
  multerUpload.single("file")(req, res, (err) => {
    handleMulterError(err, next, 1); // Handle Multer error
    next();
  });
};

// Middleware to handle multiple file upload
export const multipleFiles = (req, res, next) => {
  multerUpload.array("files", 5)(req, res, (err) => {
    handleMulterError(err, next, 5); // Handle Multer error
    next();
  });
};
