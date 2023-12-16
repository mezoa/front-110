// Import necessary modules and components
import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Create expense category slice
const expenseCategorySlice = createSlice({
    name: "expense_category",
    initialState: {
        current_page: 1,
        total_pages: 0,
        limit: 10,
        q_name: "",
        expense_categories: [],
        edit_expense_category_id: null,
        view_expense_category_id: null,
        add_expense_category_errors: {},
        edit_expense_category_errors: {},
        current_expense_category_item: {
            id: "",
            name: "",
        },
    },
    reducers: {
        resetCurrentExpenseCatData(state) {
            state.current_expense_category_item = {
                id: "",
                name: "",
            };
            state.add_expense_category_errors = [];
            state.edit_expense_category_errors = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Add your existing extra reducers here
            .addCase(addExpenseCat.fulfilled, (state, action) => {
                state.resetCurrentExpenseCatData();
            })
            .addCase(addExpenseCat.rejected, (state, action) => {
                const dispatch = useDispatch();
                dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                        message: "Error Occurred",
                        type: "error",
                        time: 2000,
                    },
                });

                if (action.payload.response.status === 422) {
                    state.add_expense_category_errors = formatValidationErrors(
                        action.payload.response.data.errors
                    );
                }
            })
            // Add your existing extra reducers here
    },
});

// Export useExpenseCategoryStore hook
export const useExpenseCategoryStore = () => {
    const dispatch = useDispatch();
    return {
        ...expenseCategorySlice,
        dispatch,
    };
};
