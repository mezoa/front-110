import axiosInstance from '../../../hooks/axiosinstance';
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../../shared/notification/notification-container";
import formatValidationErrors from "../../utils/format-validation-error";


export const useIncomeStore = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state); // Get the current state from the Redux store


  const initialState = {
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

        incomes: [],

        edit_income_id: null,
        view_income_id: null,

        add_income_errors: {},

        edit_income_errors: {},

        current_income_item: {
            id: "",
            title: "",
            amount: 0,
            entry_date: "",
            description: "",
            categories: [],
        },
    };

    const resetCurrentIncomeData = () => {
        dispatch({ type: "RESET_CURRENT_INCOME_DATA" });
    };

    const fetchIncomes = async (page, limit, q_title = "") => {
        try {
          const incomes = state.incomes || {};
          const response = await axiosInstance.get(
            `/api/incomes?page=${page}&limit=${limit}&title=${q_title}&category=${incomes.q_category}&start_amount=${incomes.q_start_amount}&end_amount=${incomes.q_end_amount}&start_date=${incomes.q_start_date}&end_date=${incomes.q_end_date}&sort_column=${incomes.q_sort_column}&sort_order=${incomes.q_sort_order}`
          );
          dispatch({ type: "SET_INCOMES", payload: response.data.data });
          // ... (rest of your code)
          return response.data.data;
        } catch (error) {
          throw error;
        }
      };

    const fetchIncome = async (id) => {
        try {
            const response = await axiosInstance.get(`/api/incomes/${id}`);
            dispatch({ type: "SET_CURRENT_INCOME_ITEM", payload: response.data.data });
            dispatch({ type: "SET_CURRENT_INCOME_ITEM_CATEGORIES_DETAILS", payload: response.data.data.categories });
            dispatch({ type: "SET_CURRENT_INCOME_ITEM_CATEGORIES", payload: response.data.data.categories.map((item) => item.value) });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    const addIncome = async (data) => {
        console.log(data)
        try {
            console.log(data)
            const response = await axiosInstance.post('/api/incomes', data);
    
            if (response && response.data) {
                resetCurrentIncomeData();
                dispatch(addNotification("Income Added Successfully", "success", 2000));
                return response;
            } else {
                console.error('API response is undefined or data is not available');
            }
        } catch (error) {
            dispatch(addNotification("Error Occurred", "error", 2000));
            console.log("error", error.response && error.response.data ? error.response.data.errors : error)
            if (error.response && error.response.status == 422) {
                dispatch({ type: "SET_ADD_INCOME_ERRORS", payload: formatValidationErrors(error.response.data.errors) });
            }
            throw error;
        }
    };

    const editIncome = async (data) => {
        try {
            const response = await axiosInstance.put(`/api/incomes/${state.edit_income_id}`, data);
            resetCurrentIncomeData();
            dispatch(addNotification("income record updated successfully", "success"));
            return response;
        } catch (errors) {
            console.log(errors);
            dispatch(addNotification("Error Occurred", "error"));
            if (errors.response.status == 422) {
                dispatch({ type: "SET_EDIT_INCOME_ERRORS", payload: formatValidationErrors(errors.response.data.errors) });
            }
            throw errors;
        }
    };

    const deleteIncome = async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/incomes/${id}`);
            if (state.incomes.length == 1 || (Array.isArray(id) && id.length == state.incomes.length)) {
                dispatch({ type: "DECREMENT_CURRENT_PAGE" });
            }
            resetCurrentIncomeData();
            dispatch(addNotification("income deleted successfully", "success", 2000));
            return response;
        } catch (error) {
            throw error;
        }
    };
    return {
        state: initialState,
        resetCurrentIncomeData,
        fetchIncomes,
        fetchIncome,
        addIncome,
        editIncome,
        deleteIncome,
      };
    };