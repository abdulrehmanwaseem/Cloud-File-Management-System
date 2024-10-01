import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multipleFiles, singleFile } from "../middlewares/multer.js";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  updateFile,
  uploadFiles,
  getStreamVideo,
  uploadStreamVideo,
} from "../controllers/file.controller.js";
import redisCache from "../config/DB/redis.config.js";

export const fileRouter = Router();

fileRouter.use(isAuthenticated);

fileRouter.route("/upload-stream-video").post(singleFile, uploadStreamVideo);

fileRouter.route("/get-stream-video").get(getStreamVideo);

fileRouter.route("/").get(getAllFiles).post(multipleFiles, uploadFiles);

fileRouter
  .route("/:id")
  .get(redisCache.route(), getFileById)
  .put(multipleFiles, updateFile)
  .delete(deleteFile);
