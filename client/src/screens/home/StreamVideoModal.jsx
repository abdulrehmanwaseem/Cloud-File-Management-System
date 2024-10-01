import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import { Plus, Upload, X } from "lucide-react";
import {
  useLazyGetStreamVideoQuery,
  useUploadStreamVideoMutation,
} from "../../redux/apis/fileApi";
import { toast } from "react-toastify";

const StreamVideoModal = () => {
  const [uploadFile] = useUploadStreamVideoMutation();
  const [fileName, setFileName] = useState("");

  const [trigger, { data }] = useLazyGetStreamVideoQuery({
    fileName: "7cdfb1e8-ef6e-4684-9e24-83d75752960a-file_example_MP4_480_1_5MG",
  });

  const onUploadHandler = async ({ files }) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const data = await uploadFile(formData).unwrap();
      setFileName(data.fileName);
      await trigger(1);
      toast.success("Stream Video Uploaded Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading stream video");
    }
  };

  const chooseOptions = {
    label: "Select File",
    icon: <Plus />,
    className: "btn btn-info text-white",
  };

  const uploadOptions = {
    label: "Upload File",
    icon: <Upload />,
    className: "btn btn-success text-white",
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton } = options;
    return (
      <>
        <div className={`${className} flex justify-between items-center gap-2`}>
          {chooseButton}
          {uploadButton}
        </div>
        <div className="flex flex-col w-full -my-6">
          <div className="divider divider-info"></div>
        </div>
      </>
    );
  };
  const videoUrl = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));

  return (
    <div>
      <p>This feature is currently in working😁</p>
    </div>
  );

  return (
    <>
      <FileUpload
        name="file"
        customUpload
        uploadHandler={onUploadHandler}
        multiple={false}
        accept="video/*"
        maxFileSize={5 * 1024 * 1024 * 1024} // 5GB in bytes
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={{
          label: "Cancel All",
          icon: <X />,
          className: `hidden`,
        }}
        headerTemplate={headerTemplate}
        emptyTemplate={
          <div className="flex justify-center p-10">
            <p>Drag and drop files here to upload.</p>
          </div>
        }
      />
      <div>
        <video controls src={data}>
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default StreamVideoModal;
