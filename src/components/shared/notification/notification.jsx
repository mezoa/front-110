import React, { useEffect, useRef } from "react";
import CrossIcon from "../../../assets/icons/crossicon";

const Notification = ({ data, onClose }) => {
  const barRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (barRef.current) {
        barRef.current.style.width = `${barRef.current.offsetWidth - 1}px`;
      }
    }, data.time / 100);

    setTimeout(() => onClose(), data.time);

    return () => {
      clearInterval(timer);
    };
  }, [data.time, onClose]);

  return (
    <div
      className={`alert notification_item shadow-lg ${
        data.type === 'success'
          ? 'alert-success'
          : data.type === 'error'
          ? 'alert-danger'
          : data.type === 'warning'
          ? 'alert-warning'
          : 'alert-info'
      }`}
    >
      <div
        className="bar"
        ref={barRef}
        style={{ backgroundColor: 'currentColor', height: '3px' }}
      ></div>
      <span className="close_notification_btn" onClick={onClose}>
        <CrossIcon width="16px" height="16px" color="#FF7474" />
      </span>
      <p className="notification-message">{data.message}</p>
    </div>
  );
};

export default Notification;
