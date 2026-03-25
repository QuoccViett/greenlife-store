import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReduce from './authSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReduce
    }
})