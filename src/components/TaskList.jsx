import React, { useState } from "react";
import { Search, ArrowUpDown, Filter } from "lucide-react";
import TaskItem from "./TaskItem";
import { filterTasks } from "../utils/taskUtils";

const TaskList = ({
  tasks,
  filter,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  tags,
  onStartPomodoro,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredTasks = filterTasks(tasks, filter).filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const getFilterTitle = () => {
    switch (filter) {
      case "completed":
        return "Completed Tasks";
      case "pending":
        return "Pending Tasks";
      case "overdue":
        return "Overdue Tasks";
      default:
        return "All Tasks";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getFilterTitle()}
        </h2>
        <p className="text-gray-600">
          {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm
                ? `No tasks match "${searchTerm}". Try adjusting your search.`
                : "Get started by adding your first task!"}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              allTags={tags}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onStartPomodoro={onStartPomodoro}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
