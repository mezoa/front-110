import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useNotificationStore } from "../../shared/notification/notificationstore";

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
            .addCase(fetchCatList.fulfilled, (state, action) => {
                state.expense_categories = action.payload;
            })
            .addCase(fetchExpenseCats.fulfilled, (state, action) => {
                state.expense_categories = action.payload;
                if (action.meta) {
                    state.total_pages = action.meta.last_page;
                    state.current_page = action.meta.current_page;
                    state.limit = action.meta.per_page;
                    state.q_name = action.q_name;
                }
            })
            .addCase(fetchExpenseCat.fulfilled, (state, action) => {
                state.current_expense_category_item = action.payload;
            })
            .addCase(addExpenseCat.fulfilled, (state, action) => {
                state.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "ExpenseCat Added Successfully",
                    type: "success",
                    time: 2000,
                });
            })
            .addCase(addExpenseCat.rejected, (state, action) => {
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                    time: 2000,
                });

                if (action.payload.response.status == 422) {
                    state.add_expense_category_errors = formatValidationErrors(
                        action.payload.response.data.errors
                    );
                }
            })
            .addCase(editExpenseCat.fulfilled, (state, action) => {
                state.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "expense category updated successfully",
                    type: "success",
                });
            })
            .addCase(editExpenseCat.rejected, (state, action) => {
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                });

                if (action.payload.response.status == 422) {
                    state.edit_expense_category_errors = formatValidationErrors(
                        action.payload.response.data.errors
                    );
                }
            })
            .addCase(deleteExpenseCat.fulfilled, (state, action) => {
                if (
                    state.expense_categories.length == 1 ||
                    (Array.isArray(action.payload) &&
                        action.payload.length == state.expense_categories.length)
                ) {
                    state.current_page == 1
                        ? (state.current_page = 1)
                        : (state.current_page -= 1);
                }

                state.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "expense category deleted successfully",
                    type: "success",
                    time: 2000,
                });
            })
            .addCase(deleteExpenseCat.rejected, (state, action) => {
                if (
                    action.payload.response.data.error_type &&
                    action.payload.response.data.error_type == "HAS_CHILD_ERROR"
                ) {
                    const notifcationStore = useNotificationStore();
                    notifcationStore.pushNotification({
                        message:
                            "Category is associated with non zero expense records. Delete that expenses first.",
                        type: "error",
                        time: 5000,
                    });
                }
            });
    },
});

export const useExpenseCategoryStore = () => {
    const dispatch = useDispatch();
    return {
        ...expenseCategorySlice,
        dispatch,
    };
};
