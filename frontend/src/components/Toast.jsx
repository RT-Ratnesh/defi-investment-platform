import React, { useEffect } from 'react';

const Toast = ({ type = 'info', title, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle toast-icon"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle toast-icon"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle toast-icon"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle toast-icon"></i>;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button className="toast-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 