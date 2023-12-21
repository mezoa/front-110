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


export const fetchExpenses = (page = 1, limit = 10, q_title = "", q_category = "", q_start_amount = "", q_end_amount = "", q_start_date = "", q_end_date = "", q_sort_column = "expense_id", q_sort_order = "") => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const expenses = state.expense.expenses || {};

      const params = new URLSearchParams({
        page,
        limit,
        title: q_title || (expenses.q_title || ""),
        category: q_category || (expenses.q_category || ""), // Add the category parameter
        start_amount: q_start_amount || (expenses.q_start_amount || ""),
        end_amount: q_end_amount || (expenses.q_end_amount || ""),
        start_date: q_start_date || (expenses.q_start_date || ""),
        end_date: q_end_date || (expenses.q_end_date || ""),
        sort_column: q_sort_column || (expenses.q_sort_column || "expense_id"),
        sort_order: q_sort_order || (expenses.q_sort_order || "")
      });

      const requestUrl = `/api/expenses?${params.toString()}`;
      console.log(`Sending request to: ${requestUrl}`); // Log the request URL

      const response = await api.get(requestUrl);
      dispatch({ type: "FETCH_EXPENSES", payload: response.data.data });
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export const fetchExpense = (id) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/expenses/${id}`);
      dispatch({ type: "FETCH_EXPENSE", payload: response.data.data });
      dispatch({ type: "SET_CATEGORIES_DETAILS", payload: response.data.data.categories });
    } catch (error) {
      console.error(error);
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
  
  export const editExpense = async (data) => {
    console.log(data)
    try {
        console.log(data.expense_id)
        const { expense_id, ...dataWithoutExpenseId } = data;
        const response = await api.put(`/api/expenses/${expense_id}`, dataWithoutExpenseId);
        return response;
    } catch (errors) {
        if (errors.response.status == 422) {
            dispatch({ type: "SET_EDIT_EXPENSE_ERRORS", payload: formatValidationErrors(errors.response.data.errors) });
            //add toasty here
        }
        throw errors;
    }
}
  
  export async function deleteExpense(id) {
    console.log(id)
      try {
        const response = await api.delete(`/api/expenses/${id}`);
        console.log(response)
        return response;
      } catch (error) {
        console.log("what is the error? ", error)
        throw error;
      }
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