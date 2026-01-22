// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const getAdminStats = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        axios.get("/api/v1/admin/stats"),
        axios.get("/api/v1/admin/recent-orders"),
        axios.get("/api/v1/admin/recent-users"),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
      }
      if (ordersRes.data?.success) {
        setRecentOrders(ordersRes.data.orders || []);
      }
      if (usersRes.data?.success) {
        setRecentUsers(usersRes.data.users || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getAdminStats();
  }, [auth?.token]);

  return (
    <Layout title="Dashboard - Admin Overview">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Admin Menu */}
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          {/* Dashboard Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Top: Admin info */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors border border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome, {auth?.user?.name || "Admin"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Email:{" "}
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {auth?.user?.email}
                  </span>{" "}
                  • Contact:{" "}
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {auth?.user?.phone || "N/A"}
                  </span>
                </p>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold transition-colors shadow-sm">
                Admin Panel
              </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.usersCount}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.productsCount}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.ordersCount}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-800 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Revenue (₹)
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹ {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <p className="text-center text-slate-500 dark:text-slate-400">
                Loading dashboard...
              </p>
            )}

            {/* Bottom: Recent Orders + Users */}
            {!loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 transition-colors border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                    Recent Orders
                  </h3>
                  {recentOrders.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      No recent orders.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((o) => (
                        <div
                          key={o._id}
                          className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800/60 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              #{o._id.slice(-6)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {o?.buyer?.name} •{" "}
                              <span className="text-slate-700 dark:text-slate-200 font-medium">
                                {o?.products?.length} items
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              ₹ {o.totalAmount}
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                o.status === "Delivered"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : o.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Users */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 transition-colors border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
                    Recent Users
                  </h3>
                  {recentUsers.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      No recent users.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentUsers.map((u) => (
                        <div
                          key={u._id}
                          className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800/60 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {u.email}
                            </p>
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 transition-colors">
                            {u.role === 1 ? "Admin" : "User"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
