import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from './slice/orderSlice'

export default configureStore({
    reducer: {
        orders: ordersReducer,
    },
});