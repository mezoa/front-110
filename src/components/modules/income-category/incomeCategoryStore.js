import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../../reducers";
import { useDispatch } from "react-redux";

export const useIncomeCategoryStore = () => {
    const dispatch = useDispatch();

    const initialState = {
        current_page: 1,
        total_pages: 0,
        limit: 10,

        q_name: "",

        income_categories: [],

        edit_income_category_id: null,
        view_income_category_id: null,

        add_income_category_errors: {},

        edit_income_category_errors: {},

        current_income_category_item: {
            id: "",
            name: "",
        },
    };

    const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

    const resetCurrentIncomeCatData = () => {
        dispatch({ type: "RESET_CURRENT_INCOME_CAT_DATA" });
    };

    const fetchCatList = async () => {
        try {
            const response = await axios.get(`/api/income-categories/list`);
            return response.data.data;
        } catch (errors) {
            throw errors;
        }
    };

    const fetchIncomeCats = async (page, limit, q_name = "") => {
        try {
            const response = await axios.get(
                `/api/income-categories?page=${page}&limit=${limit}&name=${q_name}`
            );
            dispatch({ type: "FETCH_INCOME_CATS", payload: response.data.data });
            if (response.data.meta) {
                dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.meta.last_page });
                dispatch({ type: "SET_CURRENT_PAGE", payload: response.data.meta.current_page });
                dispatch({ type: "SET_LIMIT", payload: response.data.meta.per_page });
                dispatch({ type: "SET_Q_NAME", payload: q_name });
            }
            return response.data.data;
        } catch (errors) {
            throw errors;
        }
    };

    const fetchIncomeCat = async (id) => {
        try {
            const response = await axios.get(`/api/income-categories/${id}`);
            dispatch({ type: "FETCH_INCOME_CAT", payload: response.data.data });
            return response.data.data;
        } catch (errors) {
            throw errors;
        }
    };

    const addIncomeCat = async (data) => {
        try {
            const response = await axios.post(`/api/income-categories`, data);
            resetCurrentIncomeCatData();
            dispatch({ type: "ADD_NOTIFICATION", payload: { message: "IncomeCat Added Successfully", type: "success", time: 2000 } });
            return response;
        } catch (error) {
            dispatch({ type: "ADD_NOTIFICATION", payload: { message: "Error Occurred", type: "error", time: 2000 } });
            if (error.response.status == 422) {
                dispatch({ type: "SET_ADD_INCOME_CAT_ERRORS", payload: formatValidationErrors(error.response.data.errors) });
            }
            throw error;
        }
    };

    const editIncomeCat = async (data) => {
        try {
            const response = await axios.put(`/api/income-categories/${store.getState().edit_income_category_id}`, data);
            resetCurrentIncomeCatData();
            dispatch({ type: "ADD_NOTIFICATION", payload: { message: "income category updated successfully", type: "success" } });
            return response;
        } catch (errors) {
            console.log(errors);
            dispatch({ type: "ADD_NOTIFICATION", payload: { message: "Error Occurred", type: "error" } });
            if (errors.response.status == 422) {
                dispatch({ type: "SET_EDIT_INCOME_CAT_ERRORS", payload: formatValidationErrors(errors.response.data.errors) });
            }
            throw errors;
        }
    };

    const deleteIncomeCat = async (id) => {
        try {
            const response = await axios.delete(`/api/income-categories/${id}`);
            if (
                store.getState().income_categories.length == 1 ||
                (Array.isArray(id) && id.length == store.getState().income_categories.length)
            ) {
                store.getState().current_page == 1 ? dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }) : dispatch({ type: "DECREMENT_CURRENT_PAGE" });
            }
            resetCurrentIncomeCatData();
            dispatch({ type: "ADD_NOTIFICATION", payload: { message: "income category deleted successfully", type: "success", time: 2000 } });
            return response;
        } catch (errors) {
            if (
                errors.response.data.error_type &&
                errors.response.data.error_type == "HAS_CHILD_ERROR"
            ) {
                dispatch({ type: "ADD_NOTIFICATION", payload: { message: "Category is associated with non zero income records. Delete that incomes first.", type: "error", time: 5000 } });
            }
            throw errors;
        }
    };

    return {
        store,
        resetCurrentIncomeCatData,
        fetchCatList,
        fetchIncomeCats,
        fetchIncomeCat,
        addIncomeCat,
        editIncomeCat,
        deleteIncomeCat,
    };
};
