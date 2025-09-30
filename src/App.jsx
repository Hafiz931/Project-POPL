import { useState, useEffect } from "react"; // <-- 1. Impor useEffect
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ontime');
  // 2. State baru untuk menyimpan waktu saat ini, yang akan kita perbarui terus-menerus
  const [currentTime, setCurrentTime] = useState(new Date());

  // 3. useEffect untuk menjalankan timer
  useEffect(() => {
    // Jalankan fungsi ini setiap detik (1000 milidetik)
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // Perbarui state waktu saat ini
    }, 1000);

    // Fungsi cleanup: Hentikan timer saat komponen tidak lagi digunakan (untuk mencegah kebocoran memori)
    return () => clearInterval(timer);
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen pertama kali dimuat

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      done: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 4. Gunakan 'currentTime' dari state untuk perbandingan, bukan 'new Date()'
  const now = currentTime;
  const filteredTasks = tasks.filter(task => {
    const endTime = new Date(task.endTime); // Konversi waktu selesai tugas sekali saja
    if (filter === 'ontime') {
      return !task.done && endTime > now;
    }
    if (filter === 'overdue') {
      return !task.done && endTime <= now;
    }
    if (filter === 'selesai') {
      return task.done;
    }
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
      <h1>📝 NoteDo</h1>
      <TaskForm onAdd={addTask} />
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
      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}

export default App;