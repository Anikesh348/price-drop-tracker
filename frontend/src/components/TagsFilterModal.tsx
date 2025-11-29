import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface TagsFilterModalProps {
  tagsOptions: string[];
  open: boolean;
  onClose: () => void;
  onSubmit: (tags: string[], operation: "union" | "intersection") => void;
  applying?: boolean;
}

const TagsFilterModal: React.FC<TagsFilterModalProps> = ({
  tagsOptions,
  open,
  onClose,
  onSubmit,
  applying,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [operation, setOperation] = useState<"union" | "intersection">("union");
  const [search, setSearch] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedTags, operation);
  };

  // Filter tags by search
  const filteredTags = tagsOptions.filter((tag) =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-2xl border border-gray-600 max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
          {/* Close Button */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Filter with Tags
            </h2>
            <button
              onClick={onClose}
              disabled={applying}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 flex-shrink-0 ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6 flex-shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Tags Container - Scrollable */}
          <div className="mb-6 flex-1 min-h-0 overflow-hidden">
            <div
              className="modal-tags-scroll pointer-events-auto flex flex-wrap gap-2 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30 max-h-[45vh] overflow-y-auto"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "auto",
              }}
              tabIndex={0}
            >
              {filteredTags.length === 0 ? (
                <span className="text-gray-400 text-center w-full py-6">
                  No tags available
                </span>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full border transition-all duration-200 text-sm font-medium focus:outline-none flex-shrink-0
                      ${
                        selectedTags.includes(tag)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                          : "bg-gray-700/50 text-gray-200 border-gray-600/50 hover:bg-gray-600/50 hover:border-blue-500/50"
                      }`}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Operation Selection */}
          <div className="mb-6 p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30 flex-shrink-0">
            <p className="text-gray-300 text-sm font-semibold mb-3">
              Filter Mode:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                <input
                  type="radio"
                  name="operation"
                  value="union"
                  checked={operation === "union"}
                  onChange={() => setOperation("union")}
                  className="w-4 h-4 accent-blue-500 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-white font-medium block">Union</span>
                  <span className="text-gray-400 text-xs">
                    Show questions with ANY selected tag
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                <input
                  type="radio"
                  name="operation"
                  value="intersection"
                  checked={operation === "intersection"}
                  onChange={() => setOperation("intersection")}
                  className="w-4 h-4 accent-purple-500 flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-white font-medium block">
                    Intersect
                  </span>
                  <span className="text-gray-400 text-xs">
                    Show questions with ALL selected tags
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 flex-shrink-0">
            <button
              onClick={() => setSelectedTags([])}
              className="px-4 py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 font-medium shadow-md transition-colors duration-200 border border-gray-600/50 whitespace-nowrap disabled:opacity-50"
              disabled={applying || selectedTags.length === 0}
            >
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 text-gray-200 font-medium shadow-md transition-colors duration-200 border border-gray-600/50 whitespace-nowrap disabled:opacity-50"
              disabled={applying}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={applying || selectedTags.length === 0}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium shadow-lg shadow-blue-500/30 disabled:shadow-none transition-all duration-200 whitespace-nowrap"
            >
              {applying ? "Filtering..." : "Apply Filter"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TagsFilterModal;
