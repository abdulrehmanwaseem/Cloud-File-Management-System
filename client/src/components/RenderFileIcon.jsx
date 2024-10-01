import { File, FileMusic, FileText, FileType, FileVideo } from "lucide-react";
import {
  audioFormats,
  documentFormats,
  textFormats,
  videoFormats,
} from "../constants/formats";

const RenderFileIcon = (format) => {
  if (videoFormats.includes(format)) {
    return <FileVideo size={100} />;
  }

  if (audioFormats.includes(format)) {
    return <FileMusic size={100} />;
  }

  if (textFormats.includes(format)) {
    return <FileType size={100} />;
  }

  if (documentFormats.includes(format)) {
    return <FileText size={100} />;
  }

  return <File size={100} />;
};

export default RenderFileIcon;
