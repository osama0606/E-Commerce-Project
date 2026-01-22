import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import { useAuth } from "../../context/auth";

const CreateCategory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  /* =========================
      CREATE CATEGORY
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/category/create-category",
        { name },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Category created successfully");
        setName("");
        getAllCategory();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unauthorized or server error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      GET ALL CATEGORIES
  ========================= */
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  /* =========================
      UPDATE CATEGORY
  ========================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!updatedName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected?._id}`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Category updated successfully");
        setVisible(false);
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      DELETE CATEGORY
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Category deleted");
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Layout title="Dashboard - Create Category">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* ADMIN MENU */}
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          {/* CONTENT */}
          <div className="md:col-span-3 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage Categories
            </h1>

            {/* CREATE FORM */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md w-full md:w-1/2 transition-colors">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2.5 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  {loading ? "Creating..." : "Create Category"}
                </button>
              </form>
            </div>

            {/* CATEGORY TABLE */}
            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 transition-colors">
              {categories.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400">
                  No categories found
                </p>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-100">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900">
                    {categories.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {c.name}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={deleteLoading === c._id}
                            onClick={() => handleDelete(c._id)}
                          >
                            {deleteLoading === c._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* EDIT MODAL */}
            <Modal
              open={visible}
              footer={null}
              onCancel={() => setVisible(false)}
              title="Update Category"
              className="dark:[&_.ant-modal-content]:!bg-slate-900 dark:[&_.ant-modal-content]:!text-slate-100 dark:[&_.ant-modal-header]:!bg-slate-900 dark:[&_.ant-modal-header]:!text-slate-100 dark:[&_.ant-modal-title]:!text-slate-100"
            >
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2 rounded-lg hover:bg-black dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  {loading ? "Updating..." : "Update Category"}
                </button>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
