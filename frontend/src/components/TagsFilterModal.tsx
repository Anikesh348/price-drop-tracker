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

      {/* Modal - Mobile optimized */}
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto border border-gray-600">
          {/* Close Button - Visible on mobile */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="truncate">Filter Tags</span>
            </h2>
            <button
              onClick={onClose}
              disabled={applying}
              className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 flex-shrink-0 ml-2 active:scale-95 sm:active:scale-100"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
          <div className="relative mb-4 sm:mb-6 flex-shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 rounded-lg sm:rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg
              className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none"
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
          <div className="mb-4 sm:mb-6 flex-1 min-h-0 overflow-hidden">
            <div
              className="modal-tags-scroll pointer-events-auto flex flex-wrap gap-2 p-3 sm:p-4 bg-gray-800/30 rounded-lg sm:rounded-2xl border border-gray-700/30 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "auto",
              }}
              tabIndex={0}
            >
              {filteredTags.length === 0 ? (
                <span className="text-gray-400 text-xs sm:text-sm text-center w-full py-4 sm:py-6">
                  No tags available
                </span>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-200 text-xs sm:text-sm font-medium focus:outline-none flex-shrink-0 active:scale-95
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
          <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                Mode:
              </span>
              <div className="flex gap-1 sm:gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-700/30 transition-colors duration-200 active:bg-gray-700/50">
                  <input
                    type="radio"
                    name="operation"
                    value="union"
                    checked={operation === "union"}
                    onChange={() => setOperation("union")}
                    className="w-3.5 h-3.5 accent-blue-500 flex-shrink-0"
                  />
                  <span className="text-white font-medium text-xs sm:text-sm">
                    Any (Union Tags)
                  </span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-700/30 transition-colors duration-200 active:bg-gray-700/50">
                  <input
                    type="radio"
                    name="operation"
                    value="intersection"
                    checked={operation === "intersection"}
                    onChange={() => setOperation("intersection")}
                    className="w-3.5 h-3.5 accent-purple-500 flex-shrink-0"
                  />
                  <span className="text-white font-medium text-xs sm:text-sm">
                    All (Intersect Tags)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons - Full width on mobile */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 sm:px-4 py-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 active:bg-gray-500/50 text-gray-200 font-medium text-sm sm:text-base shadow-md transition-colors duration-200 border border-gray-600/50 disabled:opacity-50 flex-1 sm:flex-none"
              disabled={applying || selectedTags.length === 0}
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2.5 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 active:bg-gray-400/50 text-gray-200 font-medium text-sm sm:text-base shadow-md transition-colors duration-200 border border-gray-600/50 disabled:opacity-50 flex-1 sm:flex-none"
              disabled={applying}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={applying || selectedTags.length === 0}
              className="px-4 sm:px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium text-sm sm:text-base shadow-lg shadow-blue-500/30 disabled:shadow-none transition-all duration-200 flex-1 sm:flex-none"
            >
              {applying ? "Filtering..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TagsFilterModal;
