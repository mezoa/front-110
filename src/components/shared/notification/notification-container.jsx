import { useState } from "react";
import Notification from "./notification";
import { useNotificationStore } from "./notificationStore";

const NotificationContainer = () => {
    const notificationStore = useNotificationStore();
    const [notifications, setNotifications] = useState(notificationStore.notifications);

    const hideNotification = (notification_item) => {
        notificationStore.hideNotification(notification_item);
        setNotifications(notificationStore.notifications);
    };

    return (
        <div className="notifications_container">
            {notifications.length > 0 &&
                notifications.map((notification_item) => (
                    <Notification
                        key={notification_item.id}
                        data={notification_item}
                        onClose={() => hideNotification(notification_item)}
                    />
                ))}
        </div>
    );
};

export default NotificationContainer;
