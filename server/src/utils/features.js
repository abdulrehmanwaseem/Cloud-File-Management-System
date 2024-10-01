import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import logger from "../config/logger.js";
import { getBase64 } from "../lib/helpers.js";
import { ApiError } from "./ApiError.js";
import fs from "fs";
import { __dirname } from "../../app.js";
import { Stream } from "stream";
import path from "path";

const uploadFilesToCloudinary = async (files = []) => {
  try {
    const uploadFilePromises = files?.map((file) =>
      cloudinary.uploader.upload(getBase64(file), {
        //⬇️ Done this because cloudinary treats pdf file as resourceType: image but we want it to be raw.
        resource_type:
          file.originalname.split(".").pop() === "pdf" ? "raw" : "auto",
        public_id: uuid(),
        type: "upload",
      })
    );
    const results = await Promise.all(uploadFilePromises);
    return results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
    }));
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(error.message, 400);
  }
};

const deleteFilesFromCloudinary = async (publicIds = [], resource_type) => {
  console.log(publicIds, resource_type);
  try {
    const deleteFilePromises = publicIds.map((id, index) =>
      cloudinary.uploader.destroy(id, {
        type: "upload",
        resource_type: resource_type[index],
      })
    );
    const deletedFiles = await Promise.all(deleteFilePromises);

    return deletedFiles;
  } catch (error) {
    logger.error(error.message);
    console.log(error);
    throw new ApiError(error.message, 400);
  }
};

const saveFileAndGetPath = async (file) => {
  const uniqueFilename = `${uuid()}-${file?.originalname}`;
  const filePath = path.join(__dirname, "public", uniqueFilename);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    const readStream = new Stream.PassThrough();
    readStream.end(file?.buffer);

    readStream.pipe(writeStream);

    writeStream.on("error", reject);
    writeStream.on("finish", () => resolve(uniqueFilename));
  });
};

export {
  uploadFilesToCloudinary,
  deleteFilesFromCloudinary,
  saveFileAndGetPath,
};
