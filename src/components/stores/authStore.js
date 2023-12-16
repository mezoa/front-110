import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    fetched: false,
    user: {},
    authenticated: 0,
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload.user,
                authenticated: action.payload.authenticated,
            };
        default:
            return state;
    }
}

export const store = configureStore({
    reducer: authReducer
});

export const getAuthUser = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/api/users/authenticated-user`);
            dispatch({
                type: "SET_USER",
                payload: {
                    user: response.data.user,
                    authenticated: response.data.authenticated,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };
};
