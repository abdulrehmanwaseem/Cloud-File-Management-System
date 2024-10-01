import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../slice/auth";
import { modalSlice } from "../slice/modal";
import { apis } from "../apis/baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [modalSlice.name]: modalSlice.reducer,
    [apis.reducerPath]: apis.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apis.middleware),
});

setupListeners(store.dispatch);
