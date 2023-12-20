import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error"
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import thunk from "redux-thunk";
import { useMemo } from "react";
import {api} from "../../../hooks/axiosinstance";

const store = configureStore({
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
            q_sort_column: "expense_id",
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
                entry_date: "",
                description: "",
                category_id: "",
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
                            entry_date: "",
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


export const useExpenseStore = () => store;

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


export const fetchExpenses = (page, limit = 10, q_title = "") => { // set a default value for limit
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const expenses = state.expense.expenses || {};

      const params = new URLSearchParams({
        page,
        limit,
        title: q_title,
        category: expenses.q_category || "",
        start_amount: expenses.q_start_amount || "",
        end_amount: expenses.q_end_amount || "",
        start_date: expenses.q_start_date || "",
        end_date: expenses.q_end_date || "",
        sort_column: expenses.q_sort_column || "expense_id",
        sort_order: expenses.q_sort_order || "desc"
      });

      const response = await api.get(`/api/expenses?${params.toString()}`);
      dispatch({ type: "SET_EXPENSES", payload: response.data.data });
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
  
  async function fetchExpense(id) {
    return async (dispatch) => {
      try {
        const response = await api.get(`/expenses/${id}`);
        dispatch({ type: "FETCH_EXPENSE", payload: response.data.data });
        dispatch({ type: "SET_CATEGORIES_DETAILS", payload: response.data.data.categories });
        dispatch({ type: "SET_CATEGORIES", payload: response.data.data.categories.map((item) => item.value) });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  }
  
  export const addExpense = (expenseData) => {
    console.log(expenseData)
    return async (dispatch, getState) => {
      try {
        // Perform asynchronous operation
        const response = await api.post('/api/expenses', expenseData);
  
        // Dispatch an action when the operation is successful
        dispatch({ type: 'ADD_EXPENSE_SUCCESS', payload: response.data });
      } catch (error) {
        // Dispatch an action when the operation fails
        dispatch({ type: 'ADD_EXPENSE_FAILURE', payload: error.message });
      }
    };
  };
  
  async function editExpense(data) {
    return async (dispatch, getState) => {
      try {
        const state = getState();
        const response = await api.put(`/expenses/${state.expense.edit_expense_id}`, data);
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
        const response = await api.delete(`/expenses/${id}`);
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