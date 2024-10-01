import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    data: null,
    modal: "",
    title: "",
    isEdit: false,
    callback: null,
    multiple: false,
    modalClassName: "",
  },
  reducers: {
    openModal: (state, action) => {
      state.open = true;
      state.modal = action.payload.modal;
      state.title = action.payload.title;
      state.isEdit = action.payload.isEdit;
      state.callback = action.payload.callback;
      state.data = action.payload.data;
      state.modalClassName = action.payload.modalClassName;
      state.multiple = action.payload.multiple;
    },
    closeModal: (state) => {
      state.open = false;
      state.data = null;
      state.modal = "";
      state.title = "";
      state.isEdit = false;
      state.callback = null;
      state.modalClassName = "";
      state.multiple = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
