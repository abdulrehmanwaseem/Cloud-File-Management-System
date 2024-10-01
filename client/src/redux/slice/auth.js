import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userData: null,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
    },
    setUnAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { setAuthenticated, setUnAuthenticated } = authSlice.actions;
export default authSlice.reducer;
