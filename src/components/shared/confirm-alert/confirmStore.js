import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initialState = {
    message: "Are you sure to do this action???",
    do_action: false,
    show_confirm_box: false,
    resolve: null,
};

const confirmReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CONFIRM_ACTION":
            return {
                ...state,
                do_action: true,
                show_confirm_box: false,
            };
        case "CANCEL_ACTION":
            return {
                ...state,
                do_action: false,
                show_confirm_box: false,
            };
        case "HIDE_BOX":
            return {
                ...state,
                resolve: action.payload.resolve,
                show_confirm_box: false,
            };
        case "SHOW_BOX":
            return {
                ...state,
                message: action.payload.message ? action.payload.message : state.message,
                show_confirm_box: true,
                do_action: false,
            };
        default:
            return state;
    }
};

const store = createStore(confirmReducer, applyMiddleware(thunk));

export default store;
