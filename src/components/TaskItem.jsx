function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li style={{ marginBottom: "10px" }}>
      <span
        onClick={onToggle}
        style={{
          textDecoration: task.done ? "line-through" : "none",
          cursor: "pointer",
        }}
      >
        {task.text}
      </span>
      <button
        onClick={onDelete}
        style={{
          marginLeft: "10px",
          padding: "4px 8px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Hapus
      </button>
    </li>
  );
}

export default TaskItem;
