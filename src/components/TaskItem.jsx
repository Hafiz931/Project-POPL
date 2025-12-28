import React, { useState } from "react";
import {
  Check,
  Edit3,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
  Flag,
  Save,
  X,
} from "lucide-react";
import { formatDate, isTaskOverdue, getTaskPriority } from "../utils/taskUtils";
import TimeProgress from "./TimeProgress";

const TaskItem = ({
  task,
  onDeleteTask,
  onEditTask,
  onToggleComplete,
  allTags = [],
  onStartPomodoro,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate || "",
    reminderTime: task.reminderTime || "",
  });

  const isOverdue = isTaskOverdue(task.dueDate);
  const priority = getTaskPriority(task.priority);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (!editData.title.trim()) return;

    onEditTask(task.id, {
      ...editData,
      title: editData.title.trim(),
      description: editData.description.trim(),
      dueDate: editData.dueDate || null,
      reminderTime: editData.reminderTime || null,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
      reminderTime: task.reminderTime || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <div className="card border-2 border-primary-200">
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            className="input-field font-medium"
            placeholder="Task Title"
          />

          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            rows="2"
            className="input-field resize-none"
            placeholder="Task Description"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className="input-field text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <input
              type="datetime-local"
              name="reminderTime"
              value={editData.reminderTime}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors duration-200 shadow-sm"
            >
              <Save className="h-4 w-4 mr-1.5" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card transition-all duration-200 hover:shadow-md ${
        task.completed ? "opacity-75" : ""
      } ${isOverdue && !task.completed ? "border-l-4 border-red-500" : ""}`}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => {
            onToggleComplete(task.id);
            import("../utils/logger").then(({ logger }) => {
              logger.info(`Task completion toggled: ${task.title}`, {
                taskId: task.id,
                completed: !task.completed,
              });
            });
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? "bg-brand-500 border-brand-500 text-white shadow-sm"
              : "border-gray-300 hover:border-brand-500 bg-white"
          }`}
        >
          {task.completed && <Check className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`font-medium text-gray-900 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p
                  className={`mt-1 text-sm text-gray-600 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {task.tags &&
                task.tags.map((tagId) => {
                  const tag = allTags.find((t) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tag.id}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${tag.color}`}
                    >
                      {tag.name}
                    </span>
                  );
                })}
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${priority.color}`}
              >
                {priority.label}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <div
                  className={`flex items-center space-x-1 ${
                    isOverdue && !task.completed
                      ? "text-red-500 font-medium"
                      : ""
                  }`}
                >
                  {isOverdue && !task.completed ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                  <span>Due: {formatDate(task.dueDate)}</span>
                  {!task.completed && (
                    <div className="ml-1">
                      <TimeProgress
                        createdAt={task.createdAt}
                        dueDate={task.dueDate}
                      />
                    </div>
                  )}
                </div>
              )}

              {task.reminderTime && !task.completed && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Reminder: {formatDate(task.reminderTime)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onStartPomodoro(task)}
                className="p-1 text-gray-400 hover:text-brand-600 transition-colors"
                title="Start Focus Timer"
              >
                <Clock className="h-4 w-4" />
              </button>
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-brand-600 transition-colors"
                title="Edit Task"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  onDeleteTask(task.id);
                  import("../utils/logger").then(({ logger }) => {
                    logger.warn(`Task deleted: ${task.title}`, {
                      taskId: task.id,
                    });
                  });
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
