import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error"
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useMemo } from "react";


export const useExpenseStore = () => configureStore({
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

    return useMemo(() => ({
        resetCurrentExpenseData: () => dispatch({ type: "RESET_CURRENT_EXPENSE_DATA" }),
        fetchExpenses: (page, limit, q_title = "") => dispatch(fetchExpenses(page, limit, q_title)),
        fetchExpense: (id) => dispatch(fetchExpense(id)),
        addExpense: (data) => dispatch(addExpense(data)),
        editExpense: (data) => dispatch(editExpense(data)),
        deleteExpense: (id) => dispatch(deleteExpense(id)),
    }), [dispatch]);
}
