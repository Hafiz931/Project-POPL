import React, { useMemo } from "react"; // Hapus useState & useEffect, Ganti dengan useMemo
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";
import { isTaskOverdue, formatDate } from "../utils/taskUtils"; // Asumsi impor utilitas

// =================================================================
// KOMPONEN UTILITAS (DIDEKLARASIKAN DI LUAR KOMPONEN UTAMA)
// =================================================================

const StatCard = ({ title, value, color, bgColor, Icon }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    {/* Menggunakan prop bgColor dan Icon sebagai komponen dengan benar */}
    <div
      className={`p-3 rounded-full h-10 w-10 flex items-center justify-center mt-3 ${bgColor}`}
    >
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
  </div>
);

const ProgressBar = ({ percentage }) => (
  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
    <div
      className="bg-gradient-to-r from-brand-500 to-brand-400 rounded-full h-2.5 transition-all duration-1000 ease-out"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

// =================================================================
// KOMPONEN UTAMA DASHBOARD
// =================================================================

const Dashboard = ({ tasks }) => {
  // --- DERIVED STATE: Perhitungan Statistik (Menggunakan useMemo) ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const overdue = tasks.filter(
      (task) => !task.completed && isTaskOverdue(task.dueDate)
    ).length;
    const pending = total - completed - overdue;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
    };
  }, [tasks]);
  // ------------------------------------------------------------------

  // --- DERIVED STATE: Upcoming Tasks (Menggunakan useMemo) ---
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks
      .filter((task) => !task.completed && task.dueDate)
      .filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);
  // -----------------------------------------------------------

  // --- Logika Filtering Cepat untuk Quick Stats ---
  const todayTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (!task.dueDate) return false;
        const today = new Date().toDateString();
        const taskDate = new Date(task.dueDate).toDateString();
        return today === taskDate;
      }).length,
    [tasks]
  );

  const weekTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (!task.dueDate) return false;

        // Perhitungan rentang mingguan harus dibuat ulang setiap kali tasks berubah
        const now = new Date();
        // Menggunakan date-fns atau library lain lebih direkomendasikan untuk tanggal,
        // namun kita mengikuti logika dasar kode:
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.getDate() + 6);

        const taskDate = new Date(task.dueDate);

        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);

        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      }).length,
    [tasks]
  );

  const highPriorityTasks = useMemo(
    () =>
      tasks.filter((task) => task.priority === "high" && !task.completed)
        .length,
    [tasks]
  );
  // ------------------------------------------------

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your task overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          Icon={Target}
          title="Total Tasks"
          value={stats.total}
          color="text-brand-600"
          bgColor="bg-brand-100"
        />
        <StatCard
          Icon={CheckCircle}
          title="Completed"
          value={stats.completed}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          Icon={Clock}
          title="Pending"
          value={stats.pending}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          Icon={AlertTriangle}
          title="Overdue"
          value={stats.overdue}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Progress Overview
            </h3>
            <TrendingUp className="h-5 w-5 text-primary-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-gray-900">
                {stats.completionRate}%
              </span>
            </div>
            <ProgressBar percentage={stats.completionRate} />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.overdue}
              </div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            <Calendar className="h-5 w-5 text-primary-500" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Today's Tasks</span>
              <span className="font-semibold text-gray-900">{todayTasks}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">This Week's Tasks</span>
              <span className="font-semibold text-gray-900">{weekTasks}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="font-semibold text-sm text-red-600">
                {highPriorityTasks}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Tasks
            </h3>
            <Calendar className="h-5 w-5 text-primary-500" />
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No upcoming tasks in the next 7 days
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
