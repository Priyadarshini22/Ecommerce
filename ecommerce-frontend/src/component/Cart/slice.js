// src/Cart/slice.js
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    // Add item to cart with quantity
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Increase quantity if the item already exists in the cart
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push({ ...item, quantity: item.quantity });
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },

    // Update quantity of cart item (increase/decrease)
    updateCartItemQuantity: (state, action) => {
      const { productId, type } = action.payload;
      const item = state.cart.find(cartItem => cartItem.id === productId);
      if (item) {
        if (type === 'increase' && item.quantity < item.stock) {
          item.quantity += 1;
        } else if (type === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
