import { ApiError } from "../utils/ApiError.js";

const handleCastErrorDB = (err) => {
  console.log(err);
  const message = `Invalid Format of ${err.path}: (${err.value._id})`;
  return new ApiError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue;
  const formattedValue = Object.keys(value)
    .map((key) => `${key}: '${value[key]}'`)
    .join(", ");

  const message = `Duplicate field value ${formattedValue}, Please use another value!`;
  return new ApiError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join(". ")}`;
  return new ApiError(message, 400);
};

const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  err.statusCode ||= 500;
  err.message ||= "Internal Server Error";

  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") err = handleValidationErrorDB(err);

  const response = {
    success: false,
    message: err.message,
  };
  if (process.env.NODE_ENV.trim() === "DEVELOPMENT") {
    response.message = err;
    console.log("Dev Error Mounted");
  }

  return res.status(err.statusCode).json(response);
};

export default errorMiddleware;
