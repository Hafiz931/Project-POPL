/**
 * Utility sederhana untuk mengirim log dari Frontend (React) ke Backend (Node.js/Winston)
 */

export const logToBackend = async (level, message, details = {}) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${level.toUpperCase()}] ${message}`, details);
    }

    await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level,
        message,
        details,
      }),
    });
  } catch (error) {
    // Jangan sampai kegagalan logging mengganggu UX
    console.error("Gagal mengirim log ke server:", error);
  }
};

export const logger = {
  info: (msg, details) => logToBackend("info", msg, details),
  warn: (msg, details) => logToBackend("warn", msg, details),
  error: (msg, details) => logToBackend("error", msg, details),
  debug: (msg, details) => logToBackend("debug", msg, details),
};
