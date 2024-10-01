import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const handleMulterError = (err, next, maxFiles) => {
  if (err instanceof multer.MulterError) {
    if (err.field !== ("file" || "files")) {
      return next(
        new ApiError(`Invalid file field, please check the file field`, 400)
      );
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size is too large." });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        new ApiError(
          `You can only upload up to ${maxFiles} files at
           a time`,
          400
        )
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files uploaded." });
    }
    return next(new ApiError("File upload error", 400));
  } else if (err) {
    return next(new ApiError(err.message, 400));
  }
};

export default handleMulterError;
