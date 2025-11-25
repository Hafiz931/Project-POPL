import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/TaskForm";
import Dashboard from "./pages/Dashboard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { isTaskOverdue, generateId } from "./utils/taskUtils";
import PomodoroTimer from "./components/PomodoroTimer";

function App() {
  // --- STATE MANAJEMEN ---
  const [storedTasks, setTasks] = useLocalStorage("tasks", []);
  const tasks = Array.isArray(storedTasks) ? storedTasks : [];

  // Tags State
  const [storedTags, setTags] = useLocalStorage("tags", [
    { id: "1", name: "Work", color: "bg-blue-100 text-blue-800" },
    { id: "2", name: "Personal", color: "bg-green-100 text-green-800" },
    { id: "3", name: "Study", color: "bg-purple-100 text-purple-800" },
  ]);
  const tags = Array.isArray(storedTags) ? storedTags : [];

  const [activeFilter, setActiveFilter] = useState("all");
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or 'tasks'
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Pomodoro State
  const [pomodoroState, setPomodoroState] = useState({
    isOpen: false,
    activeTask: null,
  });

  // PERBAIKAN: Mengubah Set menjadi Objek untuk menyimpan ID Timeout
  // Format: { 'taskid-timestamp': timeoutId }
  const [reminders, setReminders] = useState({});

  // --- DERIVED STATE: Hitung Statistik untuk Sidebar ---
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    overdue: tasks.filter(
      (task) => !task.completed && isTaskOverdue(task.dueDate)
    ).length,
  };

  // --- LOGIKA REMINDER (Dibuat di awal agar dapat diakses oleh handlers) ---

  const handleStartPomodoro = (task) => {
    setPomodoroState({
      isOpen: true,
      activeTask: task,
    });
  };

  const setupReminder = (task) => {
    if (!task.reminderTime || task.completed) return;

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const timeDiff = reminderDate.getTime() - now.getTime();
    const reminderKey = `${task.id}-${task.reminderTime}`;

    // 1. Cek apakah sudah ada reminder, dan cek apakah waktu sudah lewat
    if (timeDiff > 0 && !reminders[reminderKey]) {
      const timeoutId = setTimeout(() => {
        // MENGGUNAKAN timeoutId

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Reminder: " + task.title, {
            body: task.description || "You have a task reminder!",
            icon: "/favicon.ico",
          });
        } else {
          alert(`Reminder: ${task.title}\n${task.description || ""}`);
        }

        // Hapus reminder dari state setelah notifikasi dikirim
        setReminders((prev) => {
          const newState = { ...prev };
          delete newState[reminderKey];
          return newState;
        });
      }, timeDiff);

      // 2. Simpan ID Timeout ke dalam state 'reminders'
      setReminders((prev) => ({ ...prev, [reminderKey]: timeoutId })); // MENGGUNAKAN timeoutId
    }
  };

  // Fungsi Pembatalan Reminder Global
  const cancelReminder = (taskId) => {
    setReminders((prev) => {
      const newState = { ...prev };
      let found = false;

      // Cari dan batalkan semua timeout yang terkait dengan taskId
      for (const key in newState) {
        if (key.startsWith(taskId)) {
          clearTimeout(newState[key]);
          delete newState[key];
          found = true;
        }
      }
      return found ? newState : prev;
    });
  };

  // --- LOGIKA UTAMA (HANDLER) ---

  // Handle adding new task
  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);

    if (newTask.reminderTime) {
      setupReminder(newTask);
    }
  };

  // Handle adding new tag
  const handleAddTag = (newTag) => {
    setTags((prev) => [...prev, newTag]);
  };

  // Handle deleting task
  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    cancelReminder(taskId); // BATALKAN REMINDER SAAT DIHAPUS
  };

  // Handle editing task
  const handleEditTask = (taskId, updatedData) => {
    const updatedTask = tasks.find((t) => t.id === taskId);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );

    // Perbarui reminder: batalkan yang lama, set yang baru
    cancelReminder(taskId);
    if (updatedData.reminderTime) {
      // Gunakan task yang sudah digabungkan untuk setup
      setupReminder({ ...updatedTask, ...updatedData });
    }
  };

  // Handle toggling task completion
  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // BATALKAN REMINDER JIKA SELESAI
    const taskToToggle = tasks.find((t) => t.id === taskId);
    if (!taskToToggle.completed) {
      // Jika baru saja ditandai completed
      cancelReminder(taskId);
    } else {
      // Jika baru saja ditandai UN-completed, set reminder jika ada
      if (taskToToggle.reminderTime) {
        setupReminder(taskToToggle);
      }
    }
  };

  // --- HOOKS SIDE EFFECT ---

  // Request notification permission on app load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Setup reminders for existing tasks on app load or tasks change
  useEffect(() => {
    // Jalankan setupReminder untuk semua tugas yang belum selesai dan memiliki reminder
    tasks.forEach((task) => {
      if (task.reminderTime && !task.completed) {
        setupReminder(task);
      }
    });
    // Ketergantungan: [tasks] dan [reminders] agar setupReminder mengambil state terbaru
  }, [tasks]);

  // --- HANDLER UI ---

  // Handle filter change from sidebar
  const handleFilterChange = (filter) => {
    if (filter === "dashboard") {
      setCurrentView("dashboard");
    } else {
      setActiveFilter(filter);
      setCurrentView("tasks");
    }
  };

  // Handle view change (dashboard/tasks)
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === "dashboard") {
      setActiveFilter("all");
    }
  };

  const getPageTitle = () => {
    if (currentView === "dashboard") return "Dashboard";
    switch (activeFilter) {
      case "pending":
        return "Pending Tasks";
      case "completed":
        return "Completed Tasks";
      case "overdue":
        return "Overdue Tasks";
      case "all":
        return "All Tasks";
      default:
        // Cek apakah filter adalah ID Tag
        const tag = tags.find((t) => t.id === activeFilter);
        return tag ? `${tag.name} Tasks` : "All Tasks";
    }
  };

  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Sidebar */}
      <Sidebar
        activeFilter={currentView === "dashboard" ? "dashboard" : activeFilter}
        onFilterChange={handleFilterChange}
        onViewChange={handleViewChange}
        taskCounts={taskCounts}
        tags={tags}
        isAddFormOpen={isAddFormOpen}
        onToggleForm={() => setIsAddFormOpen((prev) => !prev)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 px-6 py-4 flex items-center justify-end sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {/* Tombol Notifikasi/Lonceng */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Tanggal Hari Ini */}
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {currentView === "dashboard" ? (
            <Dashboard tasks={tasks} />
          ) : (
            <TaskList
              tasks={tasks}
              filter={activeFilter}
              tags={tags}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onStartPomodoro={handleStartPomodoro}
            />
          )}
        </div>
      </div>

      {/* Add Task Form (Modal/Overlay) */}
      <AddTaskForm
        isOpen={isAddFormOpen}
        onToggle={() => setIsAddFormOpen((prev) => !prev)}
        onAddTask={handleAddTask}
        tags={tags}
        onAddTag={handleAddTag}
      />

      {/* Pomodoro Timer */}
      <PomodoroTimer
        isOpen={pomodoroState.isOpen}
        onClose={() => setPomodoroState((prev) => ({ ...prev, isOpen: false }))}
        taskTitle={pomodoroState.activeTask?.title}
      />
    </div>
  );
}

export default App;
