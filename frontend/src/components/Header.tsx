import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const location = useLocation().pathname;
  const isNotLoginOrRegister =
    location !== "/login" && location !== "/register";
  const { isAuthenticated, logout, user } = useAuth();
  const showSignIn = !isAuthenticated && isNotLoginOrRegister;
  const specialUserId = "6711ecc6-43f0-47d5-8b1a-9526e91af024";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
        >
          PriceDrop
        </Link>

        <nav className="flex items-center space-x-6">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated && user?.userId === specialUserId && (
            <Link
              to="/leetcode"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors" 
            >
              Leetcode
            </Link>
          )}

          {showSignIn && (
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Log In
            </Link>
          )}

          <ThemeToggle />

          {isAuthenticated && user?.profilePicture && (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500 dark:border-blue-400 hover:opacity-90 transition"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-semibold border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    {user.name}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
