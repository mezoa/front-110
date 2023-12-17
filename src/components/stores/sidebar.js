import { createStore } from "redux";

const initialState = {
    open: true,
};

const sidebarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "TOGGLE_SIDEBAR":
            return {
                ...state,
                open: !state.open,
            };
        default:
            return state;
    }
};

export const toggleSidebar = () => {
    return {
        type: "TOGGLE_SIDEBAR",
    };
};

const store = createStore(sidebarReducer);

export const useSidebar = () => {
    const state = store.getState();
    return state.open;
};

export default store;