import React, { useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Toast: React.FC<{
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: (id: string) => void;
}> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/30",
          border: "border-green-200 dark:border-green-700",
          icon: (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ),
          text: "text-green-800 dark:text-green-200",
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/30",
          border: "border-red-200 dark:border-red-700",
          icon: (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          ),
          text: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/30",
          border: "border-yellow-200 dark:border-yellow-700",
          icon: (
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          ),
          text: "text-yellow-800 dark:text-yellow-200",
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30",
          border: "border-blue-200 dark:border-blue-700",
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          text: "text-blue-800 dark:text-blue-200",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 w-full max-w-xs sm:min-w-[300px] sm:max-w-[400px] shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
      <div
        className={`flex-grow ${styles.text} text-xs sm:text-sm font-medium line-clamp-3`}
      >
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto flex flex-col gap-2 sm:gap-3 pointer-events-none z-50 max-h-screen overflow-y-auto">
      {notifications.map((notif) => (
        <div key={notif.id} className="pointer-events-auto">
          <Toast
            id={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};
