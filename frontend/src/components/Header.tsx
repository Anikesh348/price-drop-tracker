import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const location = useLocation().pathname;
  const isNotLoginOrRegister =
    location !== "/login" && location !== "/register";
  const { isAuthenticated, logout, user } = useAuth();
  const showSignIn = !isAuthenticated && isNotLoginOrRegister;
  const specialUserId = "6711ecc6-43f0-47d5-8b1a-9526e91af024";

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Open menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
          >
            PriceDrop
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
                className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer border-2 border-blue-500 dark:border-blue-400 hover:opacity-90 transition"
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

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-3">
          <ThemeToggle />
          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-inner"
        >
          <div className="flex flex-col space-y-4">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2"
              >
                Dashboard
              </Link>
            )}

            {isAuthenticated && user?.userId === specialUserId && (
              <Link
                to="/leetcode"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2"
              >
                Leetcode
              </Link>
            )}

            {showSignIn && (
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2"
              >
                Log In
              </Link>
            )}

            {isAuthenticated && user?.profilePicture && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 dark:border-blue-400"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
