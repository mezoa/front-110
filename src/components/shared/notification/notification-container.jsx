// NotificationContainer.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notification from "./notification.jsx"

export const addNotification = (message, type, duration) => {
  return (dispatch) => {
    // Dispatch an action to add a notification to the Redux store
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { message, type, duration },
    });

    // Automatically hide the notification after the specified duration
    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION',
        payload: { message, type, duration },
      });
    }, duration);
  };
};

const NotificationContainer = () => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const hideNotification = (notificationItem) => {
    // Dispatch an action to hide a specific notification
    dispatch({
      type: 'HIDE_NOTIFICATION',
      payload: notificationItem,
    });
  };

  return (
    <div className="notifications_container">
      {notifications.length > 0 &&
        notifications.map((notificationItem) => (
          <Notification
            key={notificationItem.id}
            data={notificationItem}
            onClose={() => hideNotification(notificationItem)}
          />
        ))}
    </div>
  );
};

export default NotificationContainer;
