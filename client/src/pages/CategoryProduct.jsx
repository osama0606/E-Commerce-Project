import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios"; // ✅ use project axios instance

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API;

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.log("Category products error:", error);
      setProducts([]);
      setCategory({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={category?.name ? `Category - ${category.name}` : "Category"}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h4 className="text-3xl md:text-4xl font-bold mb-2">
            Category – {category?.name || params.slug}
          </h4>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">
            {loading
              ? "Loading products..."
              : `${products?.length || 0} result${
                  (products?.length || 0) !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {/* No products */}
        {!loading && products?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">
              No products found in this category
            </h2>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products?.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-lg dark:hover:shadow-2xl transition-all bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <div className="h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden transition-colors">
                  <img
                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-lg mb-1 line-clamp-1">
                    {p.name}
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2 transition-colors">
                    {p.description?.substring(0, 60)}...
                  </p>
                  <p className="font-bold text-lg text-green-600 mb-3">
                    ₹{Number(p.price).toLocaleString("en-IN")}
                  </p>
                  <button
                    className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
