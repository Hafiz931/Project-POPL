import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ontime');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTask = (taskData) => {
    const newTask = { ...taskData, id: Date.now(), done: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, updatedData) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updatedData } : task
    ));
  };

  const now = currentTime;
  const filteredTasks = tasks.filter(task => {
    const endTime = new Date(task.endTime);
    if (filter === 'ontime') return !task.done && endTime > now;
    if (filter === 'overdue') return !task.done && endTime <= now;
    if (filter === 'selesai') return task.done;
    return true;
  });

  const getFilterButtonStyle = (buttonFilter) => {
    const baseStyle = {
      padding: "10px 20px", border: "1px solid #646cff", borderRadius: "8px",
      cursor: "pointer", fontSize: "1em", background: "transparent", color: "#646cff"
    };
    if (filter === buttonFilter) {
      return { ...baseStyle, background: "#646cff", color: "white" };
    }
    return baseStyle;
  };

  return (
    <div>
      {/* Wadah utama dengan lebar tetap */}
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>📝 NoteDo</h1>
        <TaskForm onAdd={addTask} />

        {/* --- KODE TOMBOL FILTER YANG HILANG, SEKARANG DIKEMBALIKAN --- */}
        <div style={{ margin: "25px 0", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={() => setFilter('ontime')} style={getFilterButtonStyle('ontime')}>
            On-time
          </button>
          <button onClick={() => setFilter('overdue')} style={getFilterButtonStyle('overdue')}>
            Overdue
          </button>
          <button onClick={() => setFilter('selesai')} style={getFilterButtonStyle('selesai')}>
            Selesai
          </button>
        </div>
        {/* --- AKHIR DARI BAGIAN YANG DIKEMBALIKAN --- */}
        
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
}

export default App;