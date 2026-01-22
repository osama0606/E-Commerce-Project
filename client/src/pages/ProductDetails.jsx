// src/pages/ProductDetails.jsx – Synced with cart + wishlist + auth check
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout/Layout";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [auth] = useAuth();
  const { cart, addToCart, updateCartItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const getCartItem = useCallback(
    (id) => cart.find((item) => item._id === id),
    [cart]
  );

  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const requireLogin = (message = "Please login to continue") => {
    if (!auth?.token) {
      toast.error(message);
      navigate("/login");
      return false;
    }
    return true;
  };

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      const prod = data?.product || {};
      setProduct(prod);

      if (prod?._id && prod?.category?._id) {
        getSimilarProduct(prod._id, prod.category._id);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    if (!product?._id) return;
    if (!requireLogin("Please login to add items to cart")) return;

    const cartItem = getCartItem(product._id);
    if (cartItem) {
      toast.success("Already in cart");
      return;
    }

    addToCart(product);
    toast.success("Product added to cart");
  };

  const handleToggleWishlist = () => {
    if (!product?._id) return;
    if (!requireLogin("Please login to use wishlist")) return;
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  // ✅ Direct INR (no conversion)
  const priceINR = product?.price
    ? Number(product.price).toLocaleString("en-IN")
    : null;

  const cartItem = product?._id ? getCartItem(product._id) : null;
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

  return (
    <Layout title={product?.name || "Product Details"}>
      {/* Product Details Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 relative transition-colors">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="w-[360px] h-[320px] object-cover rounded-xl"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />

            {/* Wishlist Heart on image */}
            {product?._id && (
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-6 right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  inWishlist
                    ? "bg-red-600 text-white"
                    : "bg-slate-800/90 text-white hover:bg-slate-900"
                }`}
              >
                {inWishlist ? "❤️" : "🤍"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              {product?.category?.name}
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              {product.name}
            </h1>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-emerald-600">
              {priceINR ? `₹${priceINR}` : "N/A"}
            </span>
            {product?.price && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Inclusive of all taxes
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity (synced with cart) */}
          <div className="mt-4 flex items-center gap-4">
            {!cartItem ? (
              <button
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            ) : (
              <div className="flex items-center bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-3xl p-3 shadow-xl backdrop-blur-xl w-fit transition-colors">
                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      product._id,
                      (cartItem.quantity || 1) - 1
                    )
                  }
                  className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
                >
                  −
                </button>
                <span className="mx-4 font-black text-2xl text-slate-900 dark:text-slate-50 min-w-[3rem] text-center">
                  {cartItem.quantity || 1}
                </span>
                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      product._id,
                      (cartItem.quantity || 1) + 1
                    )
                  }
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Back / Continue */}
          <div className="pt-4">
            <button
              className="text-blue-700 dark:text-blue-300 font-semibold hover:underline transition-colors"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <hr className="my-8" />

      {/* Similar Products Section */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50 transition-colors">Similar Products ➡️</h4>

        {relatedProducts.length < 1 && (
          <p className="text-center text-slate-600 dark:text-slate-400 transition-colors">
            No Similar Products found
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          {relatedProducts?.map((p) => {
            const relPriceINR = p.price
              ? Number(p.price).toLocaleString("en-IN")
              : null;
            const relInWishlist = isInWishlist(p._id);
            const relCartItem = getCartItem(p._id);

            const handleToggleRelWishlist = () => {
              if (!requireLogin("Please login to use wishlist")) return;
              if (relInWishlist) {
                removeFromWishlist(p._id);
                toast.success("Removed from wishlist");
              } else {
                addToWishlist(p);
                toast.success("Added to wishlist");
              }
            };

            const handleAddRelatedToCart = () => {
              if (!requireLogin("Please login to add items to cart")) return;

              if (relCartItem) {
                toast.success("Already in cart");
                return;
              }

              addToCart(p);
              toast.success("Product added to cart");
            };

            return (
              <div
                key={p._id}
                className="w-64 bg-white dark:bg-slate-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer relative border border-slate-200 dark:border-slate-800 transition-all"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                {/* Image + heart */}
                <div className="relative">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRelWishlist();
                    }}
                    className={`absolute top-2 right-2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-xs transition-all ${
                      relInWishlist
                        ? "bg-red-600 text-white"
                        : "bg-slate-800/90 text-white hover:bg-slate-900"
                    }`}
                  >
                    {relInWishlist ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-semibold line-clamp-1 text-slate-900 dark:text-slate-50">{p.name}</h5>
                    <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm transition-colors">
                      {relPriceINR ? `₹${relPriceINR}` : "N/A"}
                    </h5>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors">
                    {p.description.substring(0, 60)}...
                  </p>

                  <div className="mt-3 flex justify-between gap-2">
                    <button
                      className="bg-blue-700 dark:bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-800 dark:hover:bg-blue-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p.slug}`);
                      }}
                    >
                      More Details
                    </button>
                    <button
                      className="bg-slate-900 dark:bg-slate-700 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRelatedToCart();
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
