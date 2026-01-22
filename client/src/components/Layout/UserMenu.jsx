import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-2xl p-6 border border-slate-200 dark:border-slate-800 sticky top-8 transition-colors">
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-900 dark:from-slate-50 to-indigo-500 dark:to-indigo-400 bg-clip-text text-transparent">
          User Dashboard
        </h4>
      </div>

      <nav className="space-y-3">
        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-2xl font-semibold text-sm md:text-base transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-slate-900 dark:from-indigo-600 dark:to-slate-900 text-white shadow-lg scale-[1.02]"
                : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 hover:shadow-md"
            }`
          }
        >
          👤 Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-2xl font-semibold text-sm md:text-base transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-slate-900 dark:from-indigo-600 dark:to-slate-900 text-white shadow-lg scale-[1.02]"
                : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 hover:shadow-md"
            }`
          }
        >
          📦 Orders
        </NavLink>
      </nav>
    </div>
  );
};

export default UserMenu;
