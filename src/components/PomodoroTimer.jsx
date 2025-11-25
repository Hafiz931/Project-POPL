import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, X, RotateCcw, CheckCircle } from "lucide-react";

const PomodoroTimer = ({ isOpen, onClose, taskTitle, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // 'focus' or 'break'
  const [customMinutes, setCustomMinutes] = useState(25);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Update timeLeft when customMinutes changes, but only if not active and in focus mode
  useEffect(() => {
    if (!isActive && mode === "focus") {
      setTimeLeft(customMinutes * 60);
    }
  }, [customMinutes, isActive, mode]);

  const handleComplete = () => {
    if (mode === "focus") {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pomodoro Completed!", {
          body: "Great job! Take a short break.",
        });
      }
      setMode("break");
      setTimeLeft(5 * 60);
    } else {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Break Over!", {
          body: "Ready to focus again?",
        });
      }
      setMode("focus");
      setTimeLeft(customMinutes * 60);
    }
    if (onComplete) onComplete();
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? customMinutes * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 120) {
      setCustomMinutes(val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-24 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800">
            {mode === "focus" ? "Focus Time" : "Break Time"}
          </h3>
          <p className="text-xs text-gray-500 truncate max-w-[180px]">
            {taskTitle || "No task selected"}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center mb-6">
        {!isActive && mode === "focus" ? (
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              value={customMinutes}
              onChange={handleTimeChange}
              className="w-16 text-center text-2xl font-mono font-bold text-brand-600 border-b-2 border-brand-200 focus:border-brand-600 focus:outline-none bg-transparent"
              min="1"
              max="120"
            />
            <span className="text-gray-400 font-medium">min</span>
          </div>
        ) : (
          <div className="text-4xl font-mono font-bold text-center text-brand-600 tracking-wider">
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`p-3 rounded-full text-white shadow-lg transition-transform active:scale-95 ${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-brand-600 hover:bg-brand-700"
          }`}
        >
          {isActive ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            mode === "focus" ? "bg-brand-500" : "bg-green-500"
          }`}
          style={{
            width: `${
              100 -
              (timeLeft / (mode === "focus" ? customMinutes * 60 : 5 * 60)) *
                100
            }%`,
          }}
        />
      </div>
    </div>
  );
};

export default PomodoroTimer;
