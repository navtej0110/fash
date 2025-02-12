// src/features/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total:0,
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
        state.products.push(action.payload);
        state.total += action.payload.price
    },

    removeProductFromCart: (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
        state.total += action.payload.price
    }

  },
});

export const { addProductToCart, removeProductFromCart } = cartSlice.actions;

export default cartSlice.reducer;
