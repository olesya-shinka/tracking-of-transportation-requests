import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from './slice/orderSlice'

export const store = configureStore({
    reducer: {
        orders: ordersReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;