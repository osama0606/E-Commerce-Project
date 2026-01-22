import React from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const { categories, loading } = useCategory();

  return (
    <Layout title="All Categories - Browse by Category">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            🗂️ Explore Categories
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
            Discover our carefully curated product categories
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📂</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                    Shop Now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📭</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              No Categories Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
              Please check back later
            </p>
          </div>
        )}

        {/* Stats */}
        {!loading && categories.length > 0 && (
          <div className="text-center mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
              Showing{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">
                {categories.length}
              </span>{" "}
              categories
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
