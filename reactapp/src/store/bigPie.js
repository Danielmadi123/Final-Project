import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import authSlice from "./authSlice";
import darkThemeSlice from "./darkThemeSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    counterSlice,
    authSlice,
    darkThemeSlice,
    cart: cartReducer,
  },
});

export default store;
