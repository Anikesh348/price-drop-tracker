import React, { useState } from "react";
import TagsFilterModal from "./TagsFilterModal";

type Props = {
  difficulty: string;
  solved: string;
  tagsOptions: string[];
  questions: any[];
  onDifficultyChange: (val: string) => void;
  onSolvedChange: (val: string) => void;
  onApplyTags: (tags: string[], operation: "union" | "intersection") => void;
  onSearchChange?: (val: string) => void;
  searchQuery?: string;
  applying?: boolean;
  tagsModalKey?: number;
};

const Filters: React.FC<Props> = ({
  difficulty,
  solved,
  tagsOptions,
  questions,
  onDifficultyChange,
  onSolvedChange,
  onApplyTags,
  onSearchChange,
  searchQuery = "",
  applying,
  tagsModalKey,
}) => {
  const [tagsModalOpen, setTagsModalOpen] = useState(false);

  return (
    <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
        Filters
      </h3>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title or number..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500"
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

      {/* Mobile: Stacked | Desktop: Side by side */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {/* Difficulty */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Solved */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
            Status
          </label>
          <select
            value={solved}
            onChange={(e) => onSolvedChange(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>

        {/* Tags Filter Button */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 invisible">
            Tags
          </label>
          <button
            type="button"
            onClick={() => setTagsModalOpen(true)}
            className="w-full px-2 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95 text-white rounded-lg font-medium text-xs sm:text-sm transition-all"
          >
            🏷️ Tags
          </button>
        </div>
      </div>

      <TagsFilterModal
        key={tagsModalKey}
        tagsOptions={tagsOptions}
        open={tagsModalOpen}
        onClose={() => setTagsModalOpen(false)}
        onSubmit={(tags, operation) => {
          setTagsModalOpen(false);
          onApplyTags(tags, operation);
        }}
        applying={applying}
      />
    </div>
  );
};

export default Filters;
