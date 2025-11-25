import React from "react";

const TimeProgress = ({ createdAt, dueDate }) => {
  if (!dueDate) return null;

  const start = new Date(createdAt).getTime();
  const end = new Date(dueDate).getTime();
  const now = new Date().getTime();

  if (isNaN(start) || isNaN(end)) return null;

  const totalDuration = end - start;
  const elapsed = now - start;

  // Calculate percentage (0 to 100)
  // If elapsed < 0 (created in future?), progress is 0
  // If elapsed > totalDuration (overdue), progress is 100
  let percentage = 0;
  if (totalDuration > 0) {
    percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  } else if (now > end) {
    percentage = 100;
  }

  // Determine color based on urgency
  let colorClass = "text-brand-500";
  if (percentage > 90) colorClass = "text-red-500";
  else if (percentage > 75) colorClass = "text-orange-500";
  else if (percentage > 50) colorClass = "text-yellow-500";

  // SVG parameters
  const size = 24;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      title={`${Math.round(percentage)}% time elapsed`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-500 ease-out`}
        />
      </svg>
    </div>
  );
};

export default TimeProgress;
