import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new ApiError(errorMessages, 400));
  }
  return next();
};

const registerValidator = () => [
  body("firstName").notEmpty().withMessage("Please Enter Fiest Name"),
  body("lastName").notEmpty().withMessage("Please Enter Last Name"),
  body("email").notEmpty().withMessage("Please Enter Email"),
  body("password")
    .notEmpty()
    .withMessage("Please Enter Password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
];

const loginValidator = () => [
  body("email").notEmpty().withMessage("Please Enter Email"),
  body("password").notEmpty().withMessage("Please Enter Password"),
];

export { validateHandler, registerValidator, loginValidator };
