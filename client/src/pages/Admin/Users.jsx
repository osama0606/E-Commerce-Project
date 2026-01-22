// src/pages/Admin/Users.jsx
import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data?.users) {
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter users by name or email
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* Users Content */}
          <div className="lg:col-span-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h1 className="text-4xl font-playfair font-bold text-slate-900 dark:text-white">
                All Users
              </h1>
              <span className="text-lg font-semibold px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-2xl shadow-sm transition-all">
                Total: {filteredUsers.length}
              </span>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-slate-500/20 dark:focus:ring-slate-500/20 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-300 shadow-sm hover:shadow-md text-lg placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mb-4"></div>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Loading users...
                </p>
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-3xl text-slate-400 dark:text-slate-500">
                    👥
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {searchTerm
                    ? `No users match "${searchTerm}"`
                    : "No users available."}
                </p>
              </div>
            )}

            {!loading && filteredUsers.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/50">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-transparent">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
                      >
                        <td className="px-8 py-6 text-lg font-semibold text-slate-900 dark:text-white">
                          {index + 1}
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-slate-700 dark:text-slate-300 max-w-md truncate">
                          {user.email}
                        </td>
                        <td className="px-8 py-6 text-slate-700 dark:text-slate-300">
                          {user.phone || (
                            <span className="text-slate-400 dark:text-slate-500 italic">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              user.role === 1
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700"
                                : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                user.role === 1
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {user.role === 1 ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {user.createdAt ? (
                            new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">
                              N/A
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
