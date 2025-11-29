import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isDisabled?: boolean;
}

export const SearchBar = ({ onSearch, isDisabled = false }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full rounded-lg overflow-hidden transition-all border ${
        isDisabled
          ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent shadow-md dark:shadow-lg"
      }`}
    >
      <Search
        className={`w-4 h-4 mx-3 flex-shrink-0 ${
          isDisabled ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
        }`}
      />

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        disabled={isDisabled}
      />

      {query && !isDisabled && (
        <button
          type="button"
          onClick={handleClear}
          className="mx-2 w-5 h-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-all flex-shrink-0"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className={`px-3 py-2 mx-1 rounded-md font-semibold text-sm flex-shrink-0 transition-all ${
          isDisabled
            ? "text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg active:scale-95"
        }`}
        aria-label="Search"
      >
        Search
      </button>
    </form>
  );
};
