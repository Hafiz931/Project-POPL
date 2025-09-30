import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          onToggle={() => onToggle(index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </ul>
  );
}

export default TaskList;
