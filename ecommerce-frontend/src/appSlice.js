import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  quantityUpdated: false, // Flag to check if quantities are updated after payment
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Add to cart
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    
    // Update item quantity
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },

    // Clear cart after payment
    clearCart: (state) => {
      state.cart = [];
      state.quantityUpdated = true; // Flag to indicate quantities are saved after payment
    },

    // Reset quantity updated flag
    resetQuantityUpdated: (state) => {
      state.quantityUpdated = false;
    },
  },
});

export const { addToCart, updateCartItemQuantity, removeFromCart, clearCart, resetQuantityUpdated } = appSlice.actions;
export default appSlice.reducer;
