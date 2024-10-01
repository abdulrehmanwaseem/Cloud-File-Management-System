import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import compression from "compression";
import {
  corsOptions,
  helmetOptions,
  limiterOptions,
} from "./src/constants/options.js";
import { v2 as cloudinary } from "cloudinary";
import status from "express-status-monitor";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// * Routes:
import { userRouter } from "./src/routes/user.routes.js";
import { fileRouter } from "./src/routes/file.routes.js";

// Error handling imports:
import { ApiError } from "./src/utils/ApiError.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

// * Jobs Import:
import "./src/jobs/index.js";
import rateLimit from "express-rate-limit";

// * Setup:
export const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(status());

app.use(cors(corsOptions));
app.use(express.json({ limit: "12kb" }));

app.use(cookieParser());
// app.use(helmet(helmetOptions));
app.use("/api", rateLimit(limiterOptions));
app.use(mongoSanitize());
app.use(xssClean());
app.use(
  hpp({
    whitelist: ["size", "name", "createdAt", "type", "format"],
  })
);
app.use(compression());

// * Routes:
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/files", fileRouter);

// app.use(express.static(join(__dirname, "build")));
// app.get("*", (req, res) => {
//   res.sendFile(join(__dirname, "build", "index.html"));
// });

// Api Error Handling:
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);
