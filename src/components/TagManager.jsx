import React, { useState } from "react";
import { Plus, X, Tag } from "lucide-react";
import { generateId } from "../utils/taskUtils";

const TAG_COLORS = [
  { name: "Blue", value: "bg-blue-100 text-blue-800" },
  { name: "Green", value: "bg-green-100 text-green-800" },
  { name: "Red", value: "bg-red-100 text-red-800" },
  { name: "Yellow", value: "bg-yellow-100 text-yellow-800" },
  { name: "Purple", value: "bg-purple-100 text-purple-800" },
  { name: "Pink", value: "bg-pink-100 text-pink-800" },
  { name: "Indigo", value: "bg-indigo-100 text-indigo-800" },
  { name: "Gray", value: "bg-gray-100 text-gray-800" },
];

const TagManager = ({
  tags,
  selectedTags,
  onTagSelect,
  onAddTag,
  onDeleteTag,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const newTag = {
      id: generateId(),
      name: newTagName.trim(),
      color: selectedColor.value,
    };

    onAddTag(newTag);
    setNewTagName("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <Tag className="h-4 w-4 inline mr-1" />
        Tags
      </label>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tag.color}`}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => onTagSelect(tag.id)}
                className="ml-1.5 inline-flex items-center justify-center w-3 h-3 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="h-2 w-2" />
              </button>
            </span>
          );
        })}
      </div>

      {/* Available Tags Selection */}
      <div className="flex flex-wrap gap-2">
        {tags
          .filter((t) => !selectedTags.includes(t.id))
          .map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagSelect(tag.id)}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors`}
            >
              <Plus className="h-3 w-3 mr-1" />
              {tag.name}
            </button>
          ))}

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
        >
          <Plus className="h-3 w-3 mr-1" />
          New Tag
        </button>
      </div>

      {/* Add New Tag Form */}
      {isAdding && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name..."
              className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-700 font-medium"
            >
              Add
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {TAG_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full ${
                  color.value.split(" ")[0]
                } border-2 ${
                  selectedColor.name === color.name
                    ? "border-gray-600"
                    : "border-transparent"
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
