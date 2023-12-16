import { configureStore } from "@reduxjs/toolkit";
import { createStore } from 'redux';

const initialState = {
    notifications: [],
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PUSH_NOTIFICATION":
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case "HIDE_NOTIFICATION":
            return {
                ...state,
                notifications: state.notifications.filter(
                    (notification) => notification.id !== action.payload.id
                ),
            };
        default:
            return state;
    }
};

const useNotificationStore = createStore(notificationReducer);

export { useNotificationStore };