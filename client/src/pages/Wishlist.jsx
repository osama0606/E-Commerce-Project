import React, { useCallback } from "react";
import Layout from "../components/Layout/Layout";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Wishlist = () => {
  const [auth] = useAuth();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;

  const getCartItem = useCallback(
    (id) => cart.find((item) => item._id === id),
    [cart]
  );

  const handleAddToCart = (product) => {
    if (!auth?.token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const already = getCartItem(product._id);
    if (already) {
      toast.success("Already in cart");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = (productId, productName) => {
    if (!auth?.token) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  // Guest: direct login required UI
  if (!auth?.token) {
    return (
      <Layout title="My Wishlist">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-12 text-center transition-colors">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Login Required
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg transition-colors">
              Please login to view and manage your wishlist.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Wishlist">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2">❤️ My Wishlist</h1>
          <p className="text-pink-100">
            {wishlist.length > 0
              ? `You have ${wishlist.length} item${
                  wishlist.length !== 1 ? "s" : ""
                } in your wishlist`
              : "Your wishlist is empty"}
          </p>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
              Your Wishlist is Empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg transition-colors">
              Start adding products you love!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* WISHLIST GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                const inCart = !!getCartItem(product._id);

                return (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-2xl transition-all overflow-hidden group transition-colors"
                  >
                    {/* Product Image */}
                    <div
                      className="relative h-64 bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer transition-colors"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <img
                        src={`${API}/api/v1/product/product-photo/${product._id}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(product._id, product.name);
                        }}
                        className="absolute top-3 right-3 bg-white hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full shadow-lg transition-all"
                        title="Remove from wishlist"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Already in cart badge */}
                      {inCart && (
                        <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          In Cart
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3
                        className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        {product.name}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2 transition-colors">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                          ₹{product.price}
                        </p>
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold transition-colors">
                          {product.category?.name}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={inCart}
                        className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                          inCart
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            : "bg-pink-600 hover:bg-pink-700 text-white"
                        }`}
                      >
                        {inCart ? "Already in Cart" : "🛒 Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Wishlist */}
            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear your entire wishlist?"
                    )
                  ) {
                    clearWishlist();
                    toast.success("Wishlist cleared");
                  }
                }}
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                🗑️ Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
