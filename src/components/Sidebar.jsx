import React from "react";
import {
  Home,
  CheckSquare,
  Clock,
  AlertCircle,
  Settings,
  PieChart,
} from "lucide-react";

const Sidebar = ({
  activeFilter,
  onFilterChange,
  taskCounts = {},
  tags = [],
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, count: null },
    {
      id: "all",
      label: "All Tasks",
      icon: CheckSquare,
      count: taskCounts?.total || 0,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: taskCounts?.pending || 0,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckSquare,
      count: taskCounts?.completed || 0,
    },
    {
      id: "overdue",
      label: "Overdue",
      icon: AlertCircle,
      count: taskCounts?.overdue || 0,
    },
  ];

  return (
    <div className="w-64 bg-white/90 backdrop-blur-xl h-screen shadow-xl border-r border-white/20 z-20 flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-brand-600 p-2 rounded-lg shadow-lg shadow-brand-500/30">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
            NoteDo
          </h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onFilterChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm"
                    : "text-gray-500 hover:bg-white hover:text-brand-600 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-brand-600"
                        : "text-gray-400 group-hover:text-brand-500"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>

                {item.count !== null && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors ${
                      isActive
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Tags Section */}
          <div className="pt-6 pb-2 px-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tags
            </p>
          </div>

          <div className="space-y-1">
            {tags.map((tag) => {
              const isActive = activeFilter === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => onFilterChange(tag.id)}
                  className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-brand-50 text-brand-700 shadow-sm"
                      : "text-gray-500 hover:bg-white hover:text-brand-600 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-3 ${
                      tag.color.split(" ")[0]
                    }`}
                  />
                  <span className="font-medium">{tag.name}</span>
                </button>
              );
            })}
            {tags.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-400 italic">
                No tags created yet
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mini Stats / Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Daily Progress
          </span>
          <span className="text-xs font-bold text-brand-600">
            {Math.round((taskCounts.completed / (taskCounts.total || 1)) * 100)}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div
            className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${
                (taskCounts.completed / (taskCounts.total || 1)) * 100
              }%`,
            }}
          />
        </div>

        <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all duration-200">
          <Settings className="h-5 w-5 text-gray-400 mr-3" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
