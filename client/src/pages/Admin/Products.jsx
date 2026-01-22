// src/pages/Admin/Products.jsx
import React, { useEffect, useState, useMemo } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "../../utils/axios"; // ✅ same instance as baaki pages
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) {
        setProducts(data.products || []);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // ✅ Helper: format INR
  const formatINR = (price) =>
    Number(price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  // ✅ Filter + Sort logic (without mutating original state)
  const filteredProducts = useMemo(() => {
    let result = [...products]; // <- copy, taaki state mutate na ho [web:215]

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?._id === selectedCategory
      );
    }

    // Sort
    if (sortBy === "priceHigh") {
      result = result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "priceLow") {
      result = result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "oldest") {
      result = result.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      // newest (default)
      result = result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <Layout title="Dashboard - All Products">
      <div className="max-w-7xl mx-auto px-4 py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* ADMIN MENU */}
          <div className="lg:col-span-1">
            <AdminMenu />
          </div>

          {/* PRODUCTS CONTENT */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Products ({filteredProducts.length})
              </h1>
              <Link
                to="/dashboard/admin/create-product"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-black dark:hover:bg-slate-800 transition-all font-semibold"
              >
                + Add Product
              </Link>
            </div>

            {/* FILTERS */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 mb-8 space-y-4 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
                  >
                    <option value="All" className="bg-white dark:bg-slate-800">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-white dark:bg-slate-800">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
                  >
                    <option value="newest" className="bg-white dark:bg-slate-800">Newest First</option>
                    <option value="oldest" className="bg-white dark:bg-slate-800">Oldest First</option>
                    <option value="priceLow" className="bg-white dark:bg-slate-800">Price: Low to High</option>
                    <option value="priceHigh" className="bg-white dark:bg-slate-800">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                Loading products...
              </p>
            )}

            {/* EMPTY STATE */}
            {!loading && filteredProducts.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No products found.
              </p>
            )}

            {/* PRODUCT GRID */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="group bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-200 dark:bg-slate-700">
                      <img
                        src={`${
                          import.meta.env.VITE_API
                        }/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-slate-900 dark:bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                        {formatINR(p.price)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h5 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                        {p.name}
                      </h5>

                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {p.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition-colors">
                          {p.category?.name || "Uncategorized"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded font-medium transition-colors">
                          {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
