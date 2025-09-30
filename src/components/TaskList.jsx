import TaskItem from "./TaskItem";

// Terima onUpdate sebagai props
function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
            onUpdate={onUpdate} // <-- TERUSKAN PROPS KE TASKITEM
          />
        ))
      ) : (
        <p style={{ color: '#888', marginTop: '20px' }}>Tidak ada tugas dalam kategori ini.</p>
      )}
    </ul>
  );
}

export default TaskList;