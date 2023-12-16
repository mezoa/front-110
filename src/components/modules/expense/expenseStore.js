import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error"
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const useExpenseStore = configureStore({
    reducer: {
        expense: (state = {
            current_page: 1,
            total_pages: 0,
            limit: 10,

            q_title: "",
            q_category: "",
            q_start_amount: "",
            q_end_amount: "",
            q_start_date: "",
            q_end_date: "",
            q_sort_column: "id",
            q_sort_order: "desc",

            expenses: [],

            edit_expense_id: null,
            view_expense_id: null,

            add_expense_errors: {},

            edit_expense_errors: {},

            current_expense_item: {
                id: "",
                title: "",
                amount: "",
                date: "",
                description: "",
                categories: [],
            },
        }, action) => {
            switch (action.type) {
                case "RESET_CURRENT_EXPENSE_DATA":
                    return {
                        ...state,
                        current_expense_item: {
                            id: "",
                            title: "",
                            amount: "",
                            date: "",
                            description: "",
                            categories: [],
                        },
                    };
                case "FETCH_EXPENSES":
                    return {
                        ...state,
                        expenses: action.payload,
                    };
                case "SET_TOTAL_PAGES":
                    return {
                        ...state,
                        total_pages: action.payload,
                    };
                case "SET_CURRENT_PAGE":
                    return {
                        ...state,
                        current_page: action.payload,
                    };
                case "SET_LIMIT":
                    return {
                        ...state,
                        limit: action.payload,
                    };
                case "SET_Q_TITLE":
                    return {
                        ...state,
                        q_title: action.payload,
                    };
                case "FETCH_EXPENSE":
                    return {
                        ...state,
                        current_expense_item: action.payload,
                    };
                case "SET_CATEGORIES_DETAILS":
                    return {
                        ...state,
                        current_expense_item: {
                            ...state.current_expense_item,
                            categories: action.payload,
                        },
                    };
                case "SET_CATEGORIES":
                    return {
                        ...state,
                        current_expense_item: {
                            ...state.current_expense_item,
                            categories: action.payload.map((item) => item.value),
                        },
                    };
                case "SET_ADD_EXPENSE_ERRORS":
                    return {
                        ...state,
                        add_expense_errors: action.payload,
                    };
                case "SET_EDIT_EXPENSE_ERRORS":
                    return {
                        ...state,
                        edit_expense_errors: action.payload,
                    };
                default:
                    return state;
            }
        },
    },
});

export const useNotificationStore = configureStore({
    reducer: {
        notification: (state = {
            notifications: [],
        }, action) => {
            switch (action.type) {
                case "PUSH_NOTIFICATION":
                    return {
                        ...state,
                        notifications: [...state.notifications, action.payload],
                    };
                default:
                    return state;
            }
        },
    },
});

export function useExpenseActions() {
    const dispatch = useDispatch();

    function resetCurrentExpenseData() {
        dispatch({ type: "RESET_CURRENT_EXPENSE_DATA" });
    }

    async function fetchExpenses(page, limit, q_title = "") {
        try {
            const response = await axios.get(
                `/api/expenses?page=${page}&limit=${limit}&title=${q_title}&category=${this.q_category}&start_amount=${this.q_start_amount}&end_amount=${this.q_end_amount}&start_date=${this.q_start_date}&end_date=${this.q_end_date}&sort_column=${this.q_sort_column}&sort_order=${this.q_sort_order}`
            );
            dispatch({ type: "FETCH_EXPENSES", payload: response.data.data });
            if (response.data.meta) {
                dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.meta.last_page });
                dispatch({ type: "SET_CURRENT_PAGE", payload: response.data.meta.current_page });
                dispatch({ type: "SET_LIMIT", payload: response.data.meta.per_page });
                dispatch({ type: "SET_Q_TITLE", payload: q_title });
            }
            return response.data.data;
        } catch (errors) {
            throw errors;
        }
    }

    async function fetchExpense(id) {
        try {
            const response = await axios.get(`/api/expenses/${id}`);
            dispatch({ type: "FETCH_EXPENSE", payload: response.data.data });
            dispatch({ type: "SET_CATEGORIES_DETAILS", payload: response.data.data.categories });
            dispatch({ type: "SET_CATEGORIES", payload: response.data.data.categories.map((item) => item.value) });
            return response.data.data;
        } catch (errors) {
            throw errors;
        }
    }

    async function addExpense(data) {
        try {
            const response = await axios.post(`/api/expenses`, data);
            resetCurrentExpenseData();
            dispatch({ type: "PUSH_NOTIFICATION", payload: { message: "Expense Added Successfully", type: "success", time: 2000 } });
            return response;
        } catch (error) {
            dispatch({ type: "PUSH_NOTIFICATION", payload: { message: "Error Occurred", type: "error", time: 2000 } });

            if (error.response.status == 422) {
                dispatch({ type: "SET_ADD_EXPENSE_ERRORS", payload: formatValidationErrors(error.response.data.errors) });
            }
            throw error;
        }
    }

    async function editExpense(data) {
        try {
            const response = await axios.put(`/api/expenses/${this.edit_expense_id}`, data);
            resetCurrentExpenseData();
            dispatch({ type: "PUSH_NOTIFICATION", payload: { message: "expense record updated successfully", type: "success" } });
            return response;
        } catch (errors) {
            console.log(errors);
            dispatch({ type: "PUSH_NOTIFICATION", payload: { message: "Error Occurred", type: "error" } });

            if (errors.response.status == 422) {
                dispatch({ type: "SET_EDIT_EXPENSE_ERRORS", payload: formatValidationErrors(errors.response.data.errors) });
            }
            throw errors;
        }
    }

    async function deleteExpense(id) {
        try {
            const response = await axios.delete(`/api/expenses/${id}`);
            if (
                this.expenses.length == 1 ||
                (Array.isArray(id) && id.length == this.expenses.length)
            ) {
                this.current_page == 1
                    ? (this.current_page = 1)
                    : (this.current_page -= 1);
            }

            resetCurrentExpenseData();
            dispatch({ type: "PUSH_NOTIFICATION", payload: { message: "expense deleted successfully", type: "success", time: 2000 } });
            return response;
        } catch (error) {
            throw error;
        }
    }

    return {
        resetCurrentExpenseData,
        fetchExpenses,
        fetchExpense,
        addExpense,
        editExpense,
        deleteExpense,
    };
}
