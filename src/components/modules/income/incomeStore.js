import {api} from '../../../hooks/axiosinstance';
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../../shared/notification/notification-container";
import formatValidationErrors from "../../utils/format-validation-error";


export const useIncomeStore = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state); 


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

const fetchIncomes = async (
    page = 1, 
    limit = 10, 
    q_title = "", 
    q_category = "", 
    q_start_amount = "", 
    q_end_amount = "", 
    q_start_date = initialState.q_start_date, 
    q_end_date = initialState.q_end_date, 
    q_sort_column = "", 
    q_sort_order = ""
) => {
    try {
        let url = `api/incomes?page=${page}&limit=${limit}`;
        if (q_title) url += `&title=${q_title}`;
        url += `&name=&category=${q_category || ""}`; // Always include &name and &category together, even if q_category is empty
        if (q_start_amount) url += `&start_amount=${q_start_amount}`;
        if (q_end_amount) url += `&end_amount=${q_end_amount}`;
        if (q_start_date) url += `&start_date=${q_start_date}`;
        if (q_end_date) url += `&end_date=${q_end_date}`;
        if (q_sort_column) url += `&sort_column=${q_sort_column}`;
        if (q_sort_order) url += `&sort_order=${q_sort_order}`;

        console.log('API Request URL:', url); // Log the request URL
        const response = await api.get(url);
        console.log('API Response:', response);
        if (!response.data.data) {
            console.error('No data received from API.');
            return;
        }
        dispatch({ type: "SET_INCOMES", payload: response.data.data });
        return response.data.data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};
    const fetchIncome = async (id) => {
        try {
            const response = await api.get(`/api/incomes/${id}`);
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
            const response = await api.post('/api/incomes', data);
    
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
            const response = await api.put(`/api/incomes/${state.edit_income_id}`, data);
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
            const response = await api.delete(`/api/incomes/${id}`);
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