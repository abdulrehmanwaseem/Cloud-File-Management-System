const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

const findFileDetails = (
  fileName,
  resourceType,
  format,
  sizeInBytes,
  filesUrl,
  uploaderId
) => {
  let formatByName = "";
  if (!format) {
    const parts = fileName.split(".");
    formatByName = parts[parts.length - 1];
  }

  return {
    name: fileName,
    type: resourceType,
    format: format ? format : formatByName,
    size: sizeInBytes,
    filesUrl: filesUrl,
    uploader: uploaderId,
  };
};

const maxFileSize = 10 * 1024 * 1024;

const findFileSize = (sizeInBytes) => {
  if (sizeInBytes >= 1024 * 1024) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  }
};

const generateEmailVerifyUrl = (req, url) => {
  return `${req.protocol}://${req.get("host")}/api/v1${url}`;
};

const transformFileData = (files) => {
  return files.map((file) => ({
    _id: file._id,
    name: file.name,
    type: file.type,
    format: file.format,
    size: file.size,
    filesUrl: file.filesUrl.url,
    uploader: file.uploader,
    createdAt: file.createdAt,
  }));
};

export {
  getBase64,
  findFileDetails,
  findFileSize,
  generateEmailVerifyUrl,
  transformFileData,
  maxFileSize,
};
