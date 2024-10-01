import catchAsync from "express-async-handler";
import { File } from "../models/file.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFilesFromCloudinary,
  saveFileAndGetPath,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import {
  findFileDetails,
  findFileSize,
  maxFileSize,
  transformFileData,
} from "../lib/helpers.js";
import redisCache from "../config/DB/redis.config.js";
import fs from "fs";
import { __dirname } from "../../app.js";
import path from "path";

const uploadFiles = catchAsync(async (req, res, next) => {
  const files = req.files || [];
  if (files.some((file) => file.size > maxFileSize)) {
    return next(
      new ApiError(
        `File is too large the max file size is ${findFileSize(maxFileSize)}`,
        400
      )
    );
  }

  const uploadedFiles = await uploadFilesToCloudinary(files);
  if (!uploadedFiles) {
    return next(new ApiError("Failed to upload files", 400));
  }

  const filesDetail = uploadedFiles.map((file, i) =>
    findFileDetails(
      files[i].originalname,
      file.resource_type,
      file.format,
      file.bytes,
      { public_id: file.public_id, url: file.url },
      req.user._id
    )
  );

  const createdFiles = await File.insertMany(filesDetail);
  redisCache.del("/api/v1/files*", (err) => {
    if (err) throw err;
  });

  res.status(201).json({
    status: "success",
    createdFiles,
    message: "Files uploaded successfully",
  });
});

const getAllFiles = catchAsync(async (req, res, next) => {
  const {
    search = "",
    sortOrder = "1",
    sortBy = "name",
    perPage = 18,
    page = 1,
  } = req.query;

  const searchQuery = {};

  if (search) {
    searchQuery["name"] = new RegExp(search, "i");
  }
  const skip = (parseInt(page) - 1) * parseInt(perPage);

  const filesQuery = File.find({ uploader: req.user._id, ...searchQuery });

  const files = await filesQuery
    .sort({ [sortBy]: Number(sortOrder) })
    .skip(skip)
    .limit(perPage);

  const transformedData = transformFileData(files);
  const totalRecords = await File.countDocuments({
    uploader: req.user._id,
    ...searchQuery,
  });

  res.status(200).json({
    status: "success",
    totalRecords,
    files: transformedData,
  });
});

const getFileById = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    return next(new ApiError("File not found", 404));
  }
  const transformedData = transformFileData([file]);

  res.status(200).json({
    status: "success",
    file: { ...transformedData[0] },
  });
});

const updateFile = catchAsync(async (req, res, next) => {
  const ids = req.params.id.split(",");
  const files = req.files || [];

  const findFilesToDelete = await File.find({ _id: ids });
  if (!findFilesToDelete || !findFilesToDelete.length) {
    return next(new ApiError("File not found", 404));
  }

  const publicIds = findFilesToDelete?.map((file) => file.filesUrl.public_id);

  const [deletedCloudinaryFiles, uploadedCloudinaryFiles] = await Promise.all([
    deleteFilesFromCloudinary(publicIds),
    uploadFilesToCloudinary(files),
  ]);

  if (deletedCloudinaryFiles.some((file) => file.result === "not found")) {
    return next(
      new ApiError("Error deleting files. File not found, Try again", 404)
    );
  }

  if (!uploadedCloudinaryFiles) {
    return next(new ApiError("Failed to upload files", 400));
  }

  const filesDetail = uploadedCloudinaryFiles.map((file, i) =>
    findFileDetails(
      files[i].originalname,
      file.resource_type,
      file.format,
      file.bytes,
      { public_id: file.public_id, url: file.url },
      req.user._id
    )
  );

  const updatedFilePromises = ids.map((id, index) => {
    const fileDetail = filesDetail[index];
    return File.updateOne({ _id: id }, fileDetail, {
      new: true,
      runValidators: true,
    });
  });

  const updatedFiles = await Promise.all(updatedFilePromises);

  if (!updatedFiles) {
    return next(new ApiError("Some files could not be updated", 500));
  }

  redisCache.del("/api/v1/files*", (err) => {
    if (err) throw err;
  });

  res.status(200).json({
    status: "success",
    file: updatedFiles,
  });
});

const deleteFile = catchAsync(async (req, res, next) => {
  const ids = req.params.id.split(",");
  console.log(ids);

  const findFilesToDelete = await File.find({ _id: ids });
  console.log(findFilesToDelete, "B");
  if (!findFilesToDelete || !findFilesToDelete.length) {
    return next(new ApiError("File not found", 404));
  }

  const publicIds = findFilesToDelete?.map((file) => file.filesUrl.public_id);
  const resource_type = findFilesToDelete?.map((file) => file.type);

  const [deletedFiles, deletedCloudinaryFiles] = await Promise.all([
    File.deleteMany({ _id: ids }),
    deleteFilesFromCloudinary(publicIds, resource_type),
  ]);

  redisCache.del("/api/v1/files*", (err) => {
    if (err) throw err;
  });

  // Check if any file deletion operation failed
  if (deletedCloudinaryFiles.some((file) => file.result === "not found")) {
    return next(
      new ApiError("Error deleting files. File not found, Try again", 404)
    );
  }

  res.status(200).json({
    status: "success",
    deletedCount: deletedFiles.deletedCount,
    message: "File deleted successfully",
  });
});

const uploadStreamVideo = catchAsync(async (req, res) => {
  const filePath = await saveFileAndGetPath(req.file);
  res.status(200).json({
    status: "success",
    filePath: filePath,
    message: "Stream Video File Upload successfully",
  });
});

const getStreamVideo = catchAsync(async (req, res, next) => {
  const filePath = path.join(__dirname, "public", req.query.fileName + ".mp4");
  const stat = fs.statSync(filePath);

  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

export {
  uploadFiles,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile,
  uploadStreamVideo,
  getStreamVideo,
};
