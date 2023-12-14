import React, { useEffect, useRef } from "react";
import crossSvgIcon from "../../../assets/icons/cross-svg-icon.vue";

const Notification = ({ data, close }) => {
    const barRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            barRef.current.style.width = `${barRef.current.offsetWidth - 1}px`;
        }, data.time / 100);

        setTimeout(() => close(), data.time);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div
            className={`alert notification_item shadow-lg ${
                data.type === "success"
                    ? "alert-success"
                    : data.type === "error"
                    ? "alert-danger"
                    : data.type === "warning"
                    ? "alert-warning"
                    : "alert-info"
            }`}
        >
            <div
                className="bar"
                ref={barRef}
                style={{ backgroundColor: "currentColor", height: "3px" }}
            ></div>
            <span className="close_notification_btn" onClick={close}>
                <crossSvgIcon width="16px" height="16px" color="#FF7474" />
            </span>
            <p className="notification-message">{data.message}</p>
        </div>
    );
};

export default Notification;
