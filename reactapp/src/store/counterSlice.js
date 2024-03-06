import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  counter: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    add1(state) {
      state.counter = state.counter + 1;
    },
    add(state, action) {
      console.log("action", action);
      state.counter += +action.payload;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
