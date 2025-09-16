import React from "react";
import { Routes, Route } from "react-router-dom";
import { LogIn } from "./auth/LogIn";
import Register from "./auth/Register";
import Header from "./Header";
import { Landing } from "./Landing";
import Dashboard from "./Dashboard";
import { Leetcode } from "./Leetcode";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leetcode" element={<Leetcode />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
