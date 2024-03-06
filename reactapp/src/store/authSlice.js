import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  userData: undefined,
  isBusiness: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loggedIn = true;
      state.userData = action.payload;
      state.isBusiness = action.payload.isBusiness || false;
      state.isAdmin = action.payload.isAdmin || false;
    },
    logout(state) {
      state.loggedIn = false;
      state.isBusiness = false;
      state.isAdmin = false;
      state.userData = undefined;
      
    },
    updateUserProfile(state, action) {

    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
