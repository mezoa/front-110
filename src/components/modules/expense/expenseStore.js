import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error"
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import axiosInstance from "../../../hooks/axiosinstance";


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
                categories: "",
            },
        }, action) => {
            switch (action.type) {
                case "RESET_CURRENT_EXPENSE_DATA":
                    return {
                        ...state,
                        current_expense_item: {
                            id: "",
                            title: "",
                            amount: 0,
                            date: "",
                            description: "",
                            categories: "",
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


async function fetchExpenses(page, limit, q_title = "") {
    return async (dispatch, getState) => {
      try {
        const state = getState();
        const expenses = state.expense.expenses || {};
        const response = await axiosInstance.get(
          `/expenses?page=${page}&limit=${limit}&title=${q_title}&category=${expenses.q_category}&start_amount=${expenses.q_start_amount}&end_amount=${expenses.q_end_amount}&start_date=${expenses.q_start_date}&end_date=${expenses.q_end_date}&sort_column=${expenses.q_sort_column}&sort_order=${expenses.q_sort_order}`
        );
        dispatch({ type: "FETCH_EXPENSES", payload: response.data.data });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  }
  
  async function fetchExpense(id) {
    return async (dispatch) => {
      try {
        const response = await axiosInstance.get(`/expenses/${id}`);
        dispatch({ type: "FETCH_EXPENSE", payload: response.data.data });
        dispatch({ type: "SET_CATEGORIES_DETAILS", payload: response.data.data.categories });
        dispatch({ type: "SET_CATEGORIES", payload: response.data.data.categories.map((item) => item.value) });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  }
  
  async function addExpense(data) {
    return async (dispatch) => {
      try {
        const response = await axiosInstance.post('/expenses', data);
        if (response && response.data) {
          dispatch({ type: "RESET_CURRENT_EXPENSE_DATA" });
          dispatch(addNotification("Expense Added Successfully", "success", 2000));
          return response;
        } else {
          console.error('API response is undefined or data is not available');
        }
      } catch (error) {
        dispatch(addNotification("Error Occurred", "error", 2000));
        if (error.response && error.response.status == 422) {
          dispatch({ type: "SET_ADD_EXPENSE_ERRORS", payload: formatValidationErrors(error.response.data.errors) });
        }
        throw error;
      }
    };
  }
  
  async function editExpense(data) {
    return async (dispatch, getState) => {
      try {
        const state = getState();
        const response = await axiosInstance.put(`/expenses/${state.expense.edit_expense_id}`, data);
        dispatch({ type: "RESET_CURRENT_EXPENSE_DATA" });
        dispatch(addNotification("Expense record updated successfully", "success"));
        return response;
      } catch (errors) {
        dispatch(addNotification("Error Occurred", "error"));
        if (errors.response.status == 422) {
          dispatch({ type: "SET_EDIT_EXPENSE_ERRORS", payload: formatValidationErrors(errors.response.data.errors) });
        }
        throw errors;
      }
    };
  }
  
  async function deleteExpense(id) {
    return async (dispatch, getState) => {
      try {
        const state = getState();
        const response = await axiosInstance.delete(`/expenses/${id}`);
        if (state.expense.expenses.length == 1 || (Array.isArray(id) && id.length == state.expense.expenses.length)) {
          dispatch({ type: "DECREMENT_CURRENT_PAGE" });
        }
        dispatch({ type: "RESET_CURRENT_EXPENSE_DATA" });
        dispatch(addNotification("Expense deleted successfully", "success", 2000));
        return response;
      } catch (error) {
        throw error;
      }
    };
  }
  
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