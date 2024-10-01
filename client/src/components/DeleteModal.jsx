import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slice/modal";
import { toast } from "react-toastify";

const DeleteModal = () => {
  const dispatch = useDispatch();
  const { data, multiple, callback } = useSelector((state) => state.modal);
  console.log(data);
  const { deleteFiles, toggleDeleteMode } = callback;

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (multiple) {
        await deleteFiles({ ids: data }).unwrap();
        toast.success("Files Deleted Successfully");
        toggleDeleteMode();
      } else {
        await callback({ ids: data }).unwrap();
        toast.success("File Deleted Successfully");
      }
      dispatch(closeModal());
    } catch (error) {
      toast.error("Error Deleting File, try again");
      console.log(error);
      if (toggleDeleteMode) {
        toggleDeleteMode();
      }
    }
  };
  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={formSubmitHandler}>
        <p>Are you sure? you want to delete {multiple ? "these!" : "this!"}</p>
        <div className="modal-action">
          <button className="btn btn-outline btn-sm" type="submit">
            Confirm
          </button>
          <button
            className="btn btn-outline btn-sm"
            type="button"
            onClick={() => {
              if (toggleDeleteMode) {
                toggleDeleteMode();
                dispatch(closeModal());
              } else {
                dispatch(closeModal());
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteModal;
