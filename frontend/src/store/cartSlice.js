import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, image, quantity });
      }

      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }

      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
