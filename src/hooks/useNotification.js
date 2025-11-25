import { useState, useEffect, useCallback } from "react";

const useNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === "default") {
      Notification.requestPermission().then(setPermission);
    }
  }, [permission]);

  const sendNotification = useCallback(
    (title, options = {}) => {
      if (permission === "granted") {
        new Notification(title, {
          icon: "/favicon.ico",
          ...options,
        });
      } else {
        console.log("Notification permission not granted");
        // Fallback to alert if needed, or just log
      }
    },
    [permission]
  );

  return { permission, sendNotification };
};

export default useNotification;
