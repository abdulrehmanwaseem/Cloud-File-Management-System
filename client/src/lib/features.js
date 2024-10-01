import {
  audioFormats,
  documentFormats,
  textFormats,
} from "../constants/formats";

const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const convertRawType = (type, format) => {
  if (textFormats.includes(format)) {
    return "Text";
  } else if (documentFormats.includes(format)) {
    return "Document";
  } else if (audioFormats.includes(format)) {
    return "Audio";
  } else return capitalizeFirstLetter(type);
};

const findFileSize = (sizeInBytes) => {
  if (sizeInBytes >= 1024 * 1024) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  }
};

export { transformImage, convertRawType, capitalizeFirstLetter, findFileSize };
