function TaskItem({ task, onToggle, onDelete }) {
  const formattingOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedStartTime = new Date(task.startTime).toLocaleString(
    "id-ID",
    formattingOptions
  );
  const formattedEndTime = new Date(task.endTime).toLocaleString(
    "id-ID",
    formattingOptions
  );

  // Cek overdue
  const isOverdue = new Date(task.endTime) < new Date() && !task.done;

  return (
    <li
      style={{
        marginBottom: "12px",
        padding: "15px",
        border: `1px solid ${isOverdue ? "#e53e3e" : "#444"}`,
        borderRadius: "8px",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          onClick={onToggle}
          style={{
            textDecoration: task.done ? "line-through" : "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: task.done ? "#888" : "white",
          }}
        >
          {task.text}
        </span>
        <button
          onClick={onDelete}
          style={{
            padding: "5px 10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Hapus
        </button>
      </div>
      <div style={{ fontSize: "0.9em", color: "#aaa" }}>
        <span>Mulai: {formattedStartTime}</span>
        <span style={{ margin: "0 10px" }}>|</span>
        <span>Selesai: {formattedEndTime}</span>
      </div>
    </li>
  );
}

export default TaskItem;
