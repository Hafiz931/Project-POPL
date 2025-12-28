import React, { useState } from "react";
import { Plus, X, Calendar, Flag } from "lucide-react";
import { generateId } from "../utils/taskUtils";
import TagManager from "./TagManager";

const AddTaskForm = ({ onAddTask, isOpen, onToggle, tags, onAddTag }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    reminderTime: "",
    tags: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const newTask = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      reminderTime: formData.reminderTime || null,
      tags: formData.tags,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);

    // Log activity
    import("../utils/logger").then(({ logger }) => {
      logger.info(`Task created: ${newTask.title}`, {
        taskId: newTask.id,
        priority: newTask.priority,
        hasDueDate: !!newTask.dueDate,
      });
    });

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      reminderTime: "",
      tags: [],
    });
    onToggle();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagSelect = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter((id) => id !== tagId)
          : [...prev.tags, tagId],
      };
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-lg shadow-brand-500/40 transition-all hover:scale-110 active:scale-95 z-50"
      >
        <Plus className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onToggle}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Task
            </h2>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter task title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="Enter task description..."
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Flag className="h-4 w-4 inline mr-1" />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="h-4 w-4 inline mr-1" />
                Due Date
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Reminder Time */}
            <div>
              <label
                htmlFor="reminderTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reminder Time
              </label>
              <input
                type="datetime-local"
                id="reminderTime"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Tags */}
            <TagManager
              tags={tags}
              selectedTags={formData.tags}
              onTagSelect={handleTagSelect}
              onAddTag={onAddTag}
            />

            {/* Submit Button */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onToggle}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTaskForm;
