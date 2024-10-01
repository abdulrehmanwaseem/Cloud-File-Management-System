import { convertRawType } from "../lib/features";
import { openModal } from "../redux/slice/modal";
import RenderFileIcon from "./RenderFileIcon";

const FilesList = ({
  data,
  dispatch,
  isDeleteMode,
  selectedFiles,
  setSelectedFiles,
}) => {
  const handleFileSelection = (fileId) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };
  return (
    <div
      className={`grid grid-cols-2 ${
        window.screen.width > 1800 ? "lg:grid-cols-7" : "lg:grid-cols-6"
      }  gap-4 bg-sky-700 rounded-xl p-4 lg:p-6`}
    >
      {data?.length ? (
        data?.map((item, index) => (
          <div
            key={index}
            className="flex justify-center items-center relative "
          >
            {isDeleteMode && (
              <input
                type="checkbox"
                className="absolute top-2 right-2 lg:right-4"
                checked={selectedFiles.includes(item._id)}
                onChange={() => handleFileSelection(item._id)}
              />
            )}
            <div
              className={`w-full sm:w-52 bg-black cursor-pointer border-4 ${
                isDeleteMode && selectedFiles.includes(item._id)
                  ? "border-red-500"
                  : "border-base-300"
              }`}
              onClick={() =>
                isDeleteMode
                  ? handleFileSelection(item._id)
                  : dispatch(
                      openModal({
                        modal: "preview",
                        modalClassName:
                          "max-w-5xl overflow-auto lg:overflow-hidden",
                        data: item,
                        sendId: false,
                        title: item.name,
                        callBack: null,
                      })
                    )
              }
            >
              {item.type === "image" ? (
                <img
                  src={item.filesUrl}
                  className="h-56 w-full"
                  alt="Files"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div
                  className="h-56 flex items-center justify-center text-slate-300 "
                  alt="Files"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {RenderFileIcon(item.format)}
                </div>
              )}
              <div className="bg-base-300 p-2 flex flex-col px-2">
                <p className="font-semibold truncate mb-[0.15rem] ">
                  {item.name}
                </p>
                <span className="flex justify-between w-full text-xs text-stone-500">
                  <p>{convertRawType(item.type, item.format)}</p>
                  <p>{new Date(item?.createdAt).toLocaleDateString()}</p>
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center w-[80vw] lg:w-[90vw]">
          <p className="font-semibold text-lg text-zinc-300">
            No data was found🥲
          </p>
        </div>
      )}
    </div>
  );
};

export default FilesList;
