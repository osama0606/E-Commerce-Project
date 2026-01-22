import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  const firstName = auth?.user?.name?.split(" ")[0] || "there";

  // Safely compute member since only if createdAt exists
  let memberSince = null;
  if (auth?.user?.createdAt) {
    try {
      memberSince = new Date(auth.user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      memberSince = null;
    }
  }

  return (
    <Layout title={"User Dashboard - Ecommerce App"}>
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        {/* Welcome section */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white p-8 shadow-lg dark:shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-blue-100 dark:text-blue-200">
            Manage your account and orders from one place.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar menu */}
          <div className="md:col-span-1">
            <UserMenu />
          </div>

          {/* Right content */}
          <div className="md:col-span-3">
            {/* Profile card */}
            <div className="bg-white dark:bg-slate-900 shadow-lg dark:shadow-2xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {auth?.user?.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Account owner
                  </p>
                </div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
                  👤
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    📧 Email address
                  </span>
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {auth?.user?.email}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    📱 Phone
                  </span>
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {auth?.user?.phone || "Not provided"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    🏠 Address
                  </span>
                  <span className="text-slate-900 dark:text-white font-semibold text-right">
                    {auth?.user?.address || "Not provided"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    👥 Account type
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {Number(auth?.user?.role) === 1 ? "Admin" : "Customer"}
                  </span>
                </div>
              </div>

              {memberSince && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Member since {memberSince}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
