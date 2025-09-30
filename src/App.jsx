import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  // Fungsi addTask sekarang menerima objek taskData
  const addTask = (taskData) => {
    // taskData berisi { text, startTime, endTime }
    const newTask = {
      ...taskData, // Salin semua properti dari taskData
      done: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>📝 NoteDo</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}

export default App;