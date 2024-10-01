import React, { useState } from "react";
import PreviewFileModal from "../screens/home/PreviewFileModal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slice/modal";
import ShareFileModal from "../screens/home/ShareFileModal";
import UploadFileModal from "../screens/home/UploadFileModal";
import DeleteModal from "./DeleteModal";
import StreamVideoModal from "../screens/home/StreamVideoModal";

const Modal = () => {
  const { open, modal, title, modalClassName } = useSelector(
    (state) => state.modal
  );

  const dispatch = useDispatch();
  return (
    <dialog
      className="modal p-3"
      open={open}
      data-theme={localStorage.getItem("theme") || "dark"}
    >
      <div
        className={`modal-box ${modalClassName} w-full shadow-lg shadow-sky-500 outline mt-2 customized-scrollbar`}
      >
        <button
          className="btn btn-sm btn-circle mb-1 absolute right-2 top-2"
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>
        <h3
          className={`font-bold text-xl mt-2 mb-5 ${
            localStorage.getItem("theme") !== "dark" && "text-gray-800"
          } `}
        >
          {title}
        </h3>
        {checkModal(modal)}
      </div>
    </dialog>
  );
};

const checkModal = (name) => {
  let component = null;
  switch (name) {
    case "file":
      component = <div>File</div>;
      break;
    case "preview":
      component = <PreviewFileModal />;
      break;
    case "share":
      component = <ShareFileModal />;
      break;
    case "fileUpload":
      component = <UploadFileModal />;
      break;
    case "delete":
      component = <DeleteModal />;
      break;
    case "stream":
      component = <StreamVideoModal />;
  }
  return component;
};

export default Modal;
