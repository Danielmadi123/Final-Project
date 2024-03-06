import { createSlice } from "@reduxjs/toolkit";

const storedDarkTheme = localStorage.getItem("darkTheme");
const initialState = {
  darkTheme: storedDarkTheme ? JSON.parse(storedDarkTheme) : false,
};

const darkTheme = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeTheme(state) {
      state.darkTheme = !state.darkTheme;
      localStorage.setItem("darkTheme", JSON.stringify(state.darkTheme));
    },
  },
});

export const darkThemeActions = darkTheme.actions;

export default darkTheme.reducer;
