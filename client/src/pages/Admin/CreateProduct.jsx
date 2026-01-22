// src/pages/Admin/CreateProduct.jsx
import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("1");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log("GET CATEGORY ERROR:", error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Valid quantity is required");
      return false;
    }
    if (!category) {
      toast.error("Category is required");
      return false;
    }
    if (!photo) {
      toast.error("Product photo is required");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const productData = new FormData();
      productData.append("name", name.trim());
      productData.append("description", description.trim());
      productData.append("price", String(Number(price)));
      productData.append("quantity", String(Number(quantity)));
      productData.append("category", category);
      productData.append("shipping", shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData
      );

      if (data?.success) {
        toast.success(`${name} created successfully`);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log("CREATE PRODUCT ERROR:", error.response?.data || error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong while creating product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          <div className="lg:col-span-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300">
            <h1 className="text-4xl font-playfair font-bold text-slate-900 dark:text-white mb-12 text-center">
              ➕ Create Product
            </h1>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Category Select */}
              <div>
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  📂 Select Category
                </label>
                <Select
                  bordered={false}
                  placeholder="Choose a category"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value) => setCategory(value)}
                  value={category || undefined}
                  disabled={loading}
                  className="w-full dark:!bg-slate-800 dark:!border-slate-600 dark:!text-slate-200"
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      <span className="font-medium">{c.name}</span>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  🖼️ Product Photo
                </label>
                <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl hover:border-slate-900 dark:hover:border-slate-200 transition-all duration-300 cursor-pointer bg-slate-50 dark:bg-slate-800 group hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhoto(file);
                      }
                      e.target.value = null;
                    }}
                    className="hidden"
                    disabled={loading}
                  />
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      className="h-full w-full object-cover rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <svg
                        className="w-20 h-20 mx-auto mb-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-100 mb-1">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Product Name & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="e.g., Premium Wireless Headphones"
                    disabled={loading}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 shadow-sm hover:shadow-md"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    placeholder="0.00"
                    disabled={loading}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 shadow-sm hover:shadow-md"
                    onChange={(e) => setPrice(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Description
                </label>
                <textarea
                  value={description}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  disabled={loading}
                  className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 resize-vertical bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 shadow-sm hover:shadow-md"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Quantity & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    placeholder="0"
                    disabled={loading}
                    className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-slate-900 dark:focus:border-slate-400 transition-all duration-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 shadow-sm hover:shadow-md"
                    onChange={(e) => setQuantity(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>

                {/* Shipping */}
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    📦 Shipping Available
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="radio"
                        id="shipping-yes"
                        name="shipping"
                        value="1"
                        checked={shipping === "1"}
                        onChange={(e) => setShipping(e.target.value)}
                        disabled={loading}
                        className="w-5 h-5 text-emerald-600 bg-slate-100 border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-emerald-500 rounded focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor="shipping-yes" className="ml-3 flex items-center cursor-pointer w-full">
                        <span className="font-semibold text-slate-900 dark:text-white text-lg">Yes ✓</span>
                      </label>
                    </div>
                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <input
                        type="radio"
                        id="shipping-no"
                        name="shipping"
                        value="0"
                        checked={shipping === "0"}
                        onChange={(e) => setShipping(e.target.value)}
                        disabled={loading}
                        className="w-5 h-5 text-red-600 bg-slate-100 border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-red-500 rounded focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor="shipping-no" className="ml-3 flex items-center cursor-pointer w-full">
                        <span className="font-semibold text-slate-900 dark:text-white text-lg">No ✗</span>
                      </label>
                    </div>
                    <p className={`text-sm font-medium transition-all ${
                      shipping === "1" 
                        ? "text-emerald-700 dark:text-emerald-300" 
                        : "text-red-700 dark:text-red-300"
                    }`}>
                      {shipping === "1"
                        ? "✓ This product will be delivered to customers"
                        : "✗ This product is digital or pickup only"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button - Light in dark mode */}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/50 active:border-emerald-500/50"
                onClick={handleCreate}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Creating Product...
                  </span>
                ) : (
                  "🚀 CREATE PRODUCT"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
