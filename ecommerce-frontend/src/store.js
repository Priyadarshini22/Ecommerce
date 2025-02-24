

import { combineReducers } from 'redux';
import { configureStore, createReducer } from '@reduxjs/toolkit';
import productReducer from './component/ProductList/slice';
import orderReducer from './component/Order/slice';
import authReducer from './component/Login/slice';
import cartReducer from './component/Cart/slice';
import appReducer from './appSlice';

const rootReducer = combineReducers({
  app:appReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
