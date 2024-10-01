import { Router } from "express";
import {
  getMyProfile,
  login,
  logout,
  signUp,
  twoFactorAuth,
  verifyEmail,
  verifyTwoFactorAuth,
} from "../controllers/user.controller.js";
import {
  loginValidator,
  registerValidator,
  validateHandler,
} from "../lib/validators.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleFile } from "../middlewares/multer.js";
import redisCache from "../config/DB/redis.config.js";

export const userRouter = Router();

userRouter
  .route("/signup")
  .post(singleFile, registerValidator(), validateHandler, signUp);
userRouter.route("/login").post(loginValidator(), validateHandler, login);
userRouter.route("/logout").get(logout);

userRouter.get("/verify-email", verifyEmail);

// Protected Routes:
userRouter.use(isAuthenticated);
userRouter.get("/me", redisCache.route(), getMyProfile);

userRouter.post("/two-factor-auth", twoFactorAuth);
userRouter.post("/verify-two-factor-auth", verifyTwoFactorAuth);
