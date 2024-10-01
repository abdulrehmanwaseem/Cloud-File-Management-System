import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import { toast } from "react-toastify";
import { useUploadFilesMutation } from "../../redux/apis/fileApi";
import { Plus, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slice/modal";

const UploadFileModal = () => {
  const dispatch = useDispatch();
  const { isEdit, callback, data, multiple } = useSelector(
    (state) => state.modal
  );

  const onUploadHandler = async ({ files }) => {
    if (files.length > 5) {
      toast.error("You can only upload a maximum of 5 files at a time.");
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (isEdit) {
        await callback({ data: formData, ids: data }).unwrap();
        toast.success("File edit successfully!");
      } else {
        await callback(formData).unwrap();
        toast.success("Files uploaded successfully!");
      }
      dispatch(closeModal());
    } catch (error) {
      toast.error("File upload failed!");
      console.error(error);
    }
  };

  const chooseOptions = {
    label: "Select Files",
    icon: <Plus />,
    className: "btn btn-info text-white",
  };

  const uploadOptions = {
    label: multiple ? "Upload All" : "Upload File",
    icon: <Upload />,
    className: "btn btn-success text-white",
  };

  const cancelOptions = {
    label: "Cancel All",
    icon: <X />,
    className: `btn btn-error text-white ${!multiple && "hidden"}`,
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    return (
      <>
        <div className={`${className} flex justify-between items-center `}>
          <div className="flex gap-2">
            {chooseButton}
            {uploadButton}
          </div>
          {cancelButton}
        </div>
        <div className="flex flex-col w-full -my-6">
          <div className="divider divider-info"></div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-3 card">
      <FileUpload
        name="files" // Ensure this matches the field name in the backend
        customUpload
        uploadHandler={onUploadHandler}
        multiple={multiple}
        maxFileSize={10 * 1024 * 1024} // 10MB in bytes
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        headerTemplate={headerTemplate}
        emptyTemplate={
          <div className="flex justify-center p-10">
            <p>Drag and drop files here to upload.</p>
          </div>
        }
      />
      {multiple && (
        <p className="text-red-400 text-sm">
          Note: You can only upload 5 files at a time
        </p>
      )}
    </div>
  );
};

export default UploadFileModal;
