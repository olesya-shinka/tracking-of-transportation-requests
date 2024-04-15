import { createSlice } from "@reduxjs/toolkit";
import { Order } from "../../App";

const initialState: Order[] = []

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        addOrder(state, action) {
            state.push(action.payload);
        },
        editOrder(state, action) {
            const index = state.findIndex((order) => order.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteOrder(state, action) {
            return state.filter((order) => order.id !== action.payload);
        },
    },
});

export const { addOrder, editOrder, deleteOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
