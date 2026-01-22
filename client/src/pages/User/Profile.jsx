import React, { useState } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { Modal } from "antd";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit profile form
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Safely compute "Member since"
  let memberSince = null;
  if (auth?.user?.createdAt) {
    try {
      memberSince = new Date(auth.user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      memberSince = null;
    }
  }

  // Open Edit Profile Modal
  const openEditModal = () => {
    setEditForm({
      name: auth?.user?.name || "",
      phone: auth?.user?.phone || "",
      address: auth?.user?.address || "",
    });
    setEditModalVisible(true);
  };

  // Handle Edit Profile Submit
  const handleEditSubmit = async () => {
    if (
      !editForm.name.trim() ||
      !editForm.phone.trim() ||
      !editForm.address.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/api/v1/auth/profile", editForm);

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: data?.updatedUser })
        );
        toast.success("✅ Profile updated successfully!");
        setEditModalVisible(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Password Submit
  const handlePasswordSubmit = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/api/v1/auth/profile", {
        password: passwordForm.newPassword,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("✅ Password changed successfully!");
        setPasswordModalVisible(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = Number(auth?.user?.role) === 1;

  return (
    <Layout title="User Profile">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white rounded-2xl p-8 shadow-lg transition-colors">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">👤 My Profile</h1>
          <p className="text-blue-100 dark:text-blue-200">
            View and manage your account information.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Profile content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-800 transition-colors">
              {/* Profile info */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Profile information
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border ${
                      isAdmin
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAdmin ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                    />
                    {isAdmin ? "Admin account" : "Customer account"}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Full name
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {auth?.user?.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Email address
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {auth?.user?.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Phone number
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {auth?.user?.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Member since */}
                  {memberSince && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Member since
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {memberSince}
                      </p>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    📍 Delivery address
                  </p>
                  <p className="text-base text-slate-900 dark:text-white">
                    {auth?.user?.address || "No address provided"}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={openEditModal}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> Edit profile
                  </button>

                  <button
                    onClick={() => setPasswordModalVisible(true)}
                    className="flex-1 bg-slate-900 hover:bg-black text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🔒</span> Change password
                  </button>
                </div>

                {/* Info note */}
                <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-700 p-4 rounded-lg transition-colors">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-semibold">💡 Tip:</span> Keep your
                    profile information updated for smooth order delivery and
                    notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        title="Edit profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        className="dark:[&_.ant-modal-content]:!bg-slate-900 dark:[&_.ant-modal-content]:!text-slate-100 dark:[&_.ant-modal-header]:!bg-slate-900 dark:[&_.ant-modal-header]:!text-slate-100 dark:[&_.ant-modal-title]:!text-slate-100"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Full name *
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Phone number *
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Delivery address *
            </label>
            <textarea
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
              placeholder="Enter complete address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleEditSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Save changes"}
            </button>
            <button
              onClick={() => setEditModalVisible(false)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        title="Change password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={600}
        className="dark:[&_.ant-modal-content]:!bg-slate-900 dark:[&_.ant-modal-content]:!text-slate-100 dark:[&_.ant-modal-header]:!bg-slate-900 dark:[&_.ant-modal-header]:!text-slate-100 dark:[&_.ant-modal-title]:!text-slate-100"
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Current password *
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              New password *
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Confirm new password *
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePasswordSubmit}
              disabled={loading}
              className="flex-1 bg-slate-900 hover:bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Changing..." : "Change password"}
            </button>
            <button
              onClick={() => setPasswordModalVisible(false)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Profile;
