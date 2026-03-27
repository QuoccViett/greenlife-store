import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  isLoading: false,
  error: null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },

    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUserInfo, clearError } = authSlice.actions;
export default authSlice.reducer;
