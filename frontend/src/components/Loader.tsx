import React from "react";

export const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="relative w-12 h-12">
      {/* Outer gradient ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin blur-sm opacity-75"></div>

      {/* Inner white/dark background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-full m-1"></div>

      {/* Inner animated gradient border */}
      <div
        className="absolute inset-1 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-border animate-spin"
        style={{
          WebkitMaskImage: "linear-gradient(transparent 30%, black 70%)",
          maskImage: "linear-gradient(transparent 30%, black 70%)",
        }}
      ></div>

      {/* Center circle for depth */}
      <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full"></div>
    </div>
  </div>
);
