import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  savedForLaterItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      const { payload: payloadItems } = action;
      state.items = Array.isArray(payloadItems) ? payloadItems : []; // Ensure payloadItems is an array
    },
    addToCart: (state, action) => {
      const { item } = action.payload;
      const newItem = {
        ...item,
        quantity: item.quantity || 1,
      };
      state.items = [...state.items, newItem];
    },
    removeFromCart: (state, action) => {
      const { payload: cartItemId } = action;
      state.items = state.items.filter(
        (item) => item.cartItemId !== cartItemId
      );
    },
    saveForLater: (state, action) => {
      const { payload: newItem } = action;
      state.savedForLaterItems = Array.isArray(state.savedForLaterItems)
        ? [...state.savedForLaterItems, newItem]
        : [newItem];
    },
    moveItemToCart: (state, action) => {
      const { payload: movedItem } = action;
      state.savedForLaterItems = state.savedForLaterItems.filter(
        (item) => item._id !== movedItem._id
      );
      state.items.push(movedItem);
    },
    removeFromSavedForLater: (state, action) => {
      const { payload: payloadItemId } = action;
      state.savedForLaterItems = state.savedForLaterItems.filter(
        (item) => item._id !== payloadItemId
      );
    },
    setSavedForLaterItems: (state, action) => {
      const { payload: payloadItems } = action;
      state.savedForLaterItems = payloadItems;
    },
  },
});

export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const {
  setItems,
  addToCart,
  removeFromCart,
  saveForLater,
  moveItemToCart,
  removeFromSavedForLater,
  setSavedForLaterItems,
} = cartSlice.actions;

export default cartSlice.reducer;
