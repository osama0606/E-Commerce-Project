import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const links = [
    { to: "/dashboard/admin", label: "📊 Dashboard" },
    { to: "/dashboard/admin/create-category", label: "📂 Create Category" },
    { to: "/dashboard/admin/create-product", label: "📦 Create Product" },
    { to: "/dashboard/admin/products", label: "📋 Products" },
    { to: "/dashboard/admin/orders", label: "📈 Orders" },
    { to: "/dashboard/admin/users", label: "👥 Users" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-2xl p-8 border border-slate-200 dark:border-slate-800 sticky top-8 transition-colors">
      <div className="text-center mb-8">
        <h4 className="text-3xl font-playfair font-bold bg-gradient-to-r from-slate-900 dark:from-slate-50 to-indigo-500 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
          Admin Panel
        </h4>
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-400 dark:from-indigo-600 dark:to-purple-500 rounded-2xl mx-auto shadow-lg" />
      </div>

      <nav className="space-y-3">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-5 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-slate-900 dark:from-indigo-600 dark:to-slate-900 text-white shadow-lg transform scale-105"
                  : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 hover:shadow-md"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminMenu;
