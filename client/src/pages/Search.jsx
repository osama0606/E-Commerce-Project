import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Search = () => {
  const [values] = useSearch();
  const { addToCart } = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  // ✅ yahi main fix hai:
  const results = Array.isArray(values?.results) ? values.results : [];

  const handleAddToCart = (product) => {
    if (!auth?.token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const priceINR = (price) =>
    Number(price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Layout title={"Search results"}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <h6 className="text-slate-600 dark:text-slate-400 mb-6 transition-colors">
            {results.length < 1 ? "No Products Found" : `Found ${results.length}`}
          </h6>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {results.map((p) => (
              <div
                key={p._id}
                className="w-[18rem] bg-white dark:bg-slate-900 rounded-lg shadow hover:shadow-lg dark:hover:shadow-2xl transition-all transition-colors cursor-pointer"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                  alt={p.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />

                <div
                  className="p-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h5 className="text-lg font-semibold line-clamp-2">
                    {p.name}
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                    {p.description.substring(0, 60)}...
                  </p>
                  <p className="font-medium mt-1 text-emerald-600">
                    {priceINR(p.price)}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="bg-slate-700 dark:bg-slate-800 text-white px-3 py-2 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition text-sm"
                      onClick={() => handleAddToCart(p)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <p className="text-slate-500 dark:text-slate-500 mt-6 transition-colors">
                Try searching with a different keyword.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
