import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-errors";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../../shared/notification/notificationActions";

export const useIncomeStore = () => {
    const dispatch = useDispatch();

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
            amount: "",
            date: "",
            description: "",
            categories: [],
        },
    };

    const resetCurrentIncomeData = () => {
        dispatch({ type: "RESET_CURRENT_INCOME_DATA" });
    };

    const fetchIncomes = async (page, limit, q_title = "") => {
        try {
            const response = await axios.get(
                `/api/incomes?page=${page}&limit=${limit}&title=${q_title}&category=${state.q_category}&start_amount=${state.q_start_amount}&end_amount=${state.q_end_amount}&start_date=${state.q_start_date}&end_date=${state.q_end_date}&sort_column=${state.q_sort_column}&sort_order=${state.q_sort_order}`
            );
            dispatch({ type: "SET_INCOMES", payload: response.data.data });
            if (response.data.meta) {
                dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.meta.last_page });
                dispatch({ type: "SET_CURRENT_PAGE", payload: response.data.meta.current_page });
                dispatch({ type: "SET_LIMIT", payload: response.data.meta.per_page });
                dispatch({ type: "SET_Q_TITLE", payload: q_title });
            }
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    const fetchIncome = async (id) => {
        try {
            const response = await axios.get(`/api/incomes/${id}`);
            dispatch({ type: "SET_CURRENT_INCOME_ITEM", payload: response.data.data });
            dispatch({ type: "SET_CURRENT_INCOME_ITEM_CATEGORIES_DETAILS", payload: response.data.data.categories });
            dispatch({ type: "SET_CURRENT_INCOME_ITEM_CATEGORIES", payload: response.data.data.categories.map((item) => item.value) });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    const addIncome = async (data) => {
        try {
            const response = await axios.post(`/api/incomes`, data);
            resetCurrentIncomeData();
            dispatch(addNotification("Income Added Successfully", "success", 2000));
            return response;
        } catch (error) {
            dispatch(addNotification("Error Occurred", "error", 2000));
            if (error.response.status == 422) {
                dispatch({ type: "SET_ADD_INCOME_ERRORS", payload: formatValidationErrors(error.response.data.errors) });
            }
            throw error;
        }
    };

    const editIncome = async (data) => {
        try {
            const response = await axios.put(`/api/incomes/${state.edit_income_id}`, data);
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
            const response = await axios.delete(`/api/incomes/${id}`);
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
