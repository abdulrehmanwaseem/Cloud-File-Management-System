import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "../../redux/slice/modal";
import {
  capitalizeFirstLetter,
  convertRawType,
  findFileSize,
} from "../../lib/features";
import { FileDown, Settings, Share2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import RenderFile from "../../components/RenderFile";
import {
  useDeleteFileMutation,
  useUpdateFileMutation,
} from "../../redux/apis/fileApi";

// const [trigger, { data, isLoading }] = useLazyGetSingleFileQuery();
// useEffect(() => {
//   const fetchFile = async () => {
//     if (open && id) {
//       try {
//         await trigger(id);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   fetchFile();
// }, [open, id, trigger]);
// console.log(data);

const PreviewFileModal = () => {
  const { data } = useSelector((state) => state.modal);
  const { _id, name, type, format, filesUrl, createdAt, size } = data;

  const [updateFile] = useUpdateFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const dispatch = useDispatch();

  const downloadFile = () => {
    toast.loading("Downloading file...");
    fetch(filesUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success("File Dowloaded");
      })
      .catch((error) => {
        console.error("Error dowloading the file:", error);
        toast.error("Error dowloading the file");
      });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-20 overflow-hidden">
        <div className="stats stats-vertical flex flex-col justify-start lg:justify-between w-full lg:w-1/2">
          <div className="stat">
            <div className="stat-title">Type:</div>
            <div className="stat-value">{convertRawType(type, format)}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Size:</div>
            <div className="stat-value">{findFileSize(size)}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Format:</div>
            <div className="stat-value">{capitalizeFirstLetter(format)}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Upload At:</div>
            <div className="stat-value">
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {RenderFile(filesUrl, format, name)} {/* Render the file */}
      </div>
      <div className="flex justify-center lg:justify-between modal-action mt-4 ">
        <div className="flex gap-4 ">
          <button
            className="btn  btn-primary btn-outline"
            onClick={() =>
              dispatch(
                openModal({
                  modal: "share",
                  data: filesUrl,
                  title: "Share",
                })
              )
            }
          >
            <Share2 />
            <span className="hidden lg:block">Share</span>
          </button>
          <button
            className="btn btn-success btn-outline"
            onClick={downloadFile}
          >
            <FileDown />
            <span className="hidden lg:block">Dowload</span>
          </button>
          <button
            className="btn btn-warning btn-outline"
            onClick={() =>
              dispatch(
                openModal({
                  modal: "fileUpload",
                  modalClassName: "max-w-5xl",
                  isEdit: true,
                  data: [_id],
                  title: "Update File",
                  callback: updateFile,
                })
              )
            }
          >
            <Settings />
            <span className="hidden lg:block">Update</span>
          </button>
          <button
            className="btn btn-error btn-outline"
            onClick={() =>
              dispatch(
                openModal({
                  modal: "delete",
                  isEdit: true,
                  data: [_id],
                  title: "Delete File",
                  callback: deleteFile,
                })
              )
            }
          >
            <Trash2 />
            <span className="hidden lg:block">Delete</span>
          </button>
        </div>
        <button
          className="btn hidden lg:block"
          onClick={() => dispatch(closeModal())}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default PreviewFileModal;
