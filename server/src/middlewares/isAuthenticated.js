import jwt from "jsonwebtoken";
import { USER_TOKEN } from "../constants/options.js";
import { promisify } from "util";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import logger from "../config/logger.js";

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies[USER_TOKEN];
  if (!token || token === undefined) {
    return next(
      new ApiError("You are not logged in, Please log in to get access!", 401)
    );
  }
  try {
    const decodeToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decodeToken.id).select("-password");
    if (!currentUser) {
      return next(
        new ApiError("The User belonging to this token, no longer exists", 404)
      );
    }

    if (!currentUser.isVerified) {
      return next(
        new ApiError("Please verify your email address to get access!", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    logger.error(err?.message);
    return next(
      new ApiError("Authentication failed. Please log in again.", 400)
    );
  }
};

export default isAuthenticated;
