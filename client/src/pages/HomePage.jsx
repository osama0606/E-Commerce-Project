import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "../utils/axios";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import { useAuth } from "../context/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// TOP HERO SLIDES (public/banners/banner1-4)
const heroSlides = [
  {
    id: 1,
    image: "/banners/banner1.jpg",
    title: "Mega Desi Sale",
    subtitle: "Top deals on electronics, fashion & more",
  },
  {
    id: 2,
    image: "/banners/banner2.jpg",
    title: "Latest Electronics",
    subtitle: "Mobiles, headphones, laptops at desi prices",
  },
  {
    id: 3,
    image: "/banners/banner3.jpg",
    title: "Trendy Fashion",
    subtitle: "Kurtas, t-shirts & more starting at ₹499",
  },
  {
    id: 4,
    image: "/banners/banner4.jpg",
    title: "Home & Kitchen Essentials",
    subtitle: "Everything you need for your Indian home",
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [auth] = useAuth();
  const { cart, addToCart, updateCartItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();

  const isLoggedIn = !!auth?.token;

  // HERO SLIDER STATE
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = 10000; // 5 seconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, slideInterval);

    return () => clearInterval(intervalId);
  }, []);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const goToIndex = (index) => setCurrentSlide(index);

  const requireLogin = useCallback(
    (message = "Please login to continue") => {
      if (!auth?.token) {
        toast.error(message);
        navigate("/login");
        return false;
      }
      return true;
    },
    [auth?.token, navigate]
  );

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const getCartItem = useCallback(
    (id) => cart.find((item) => item._id === id),
    [cart]
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (!requireLogin("Please login to use wishlist")) return;
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        addToWishlist(product);
        toast.success("Added to wishlist");
      }
    },
    [requireLogin, isInWishlist, addToWishlist, removeFromWishlist]
  );

  const formatINR = useCallback((price) => {
    return Number(price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  }, []);

  const productsByCategory = useMemo(() => {
    if (loading || products.length === 0) return {};
    return products.reduce((acc, p) => {
      const name = p?.category?.name || "Others";
      if (!acc[name]) acc[name] = [];
      acc[name].push(p);
      return acc;
    }, {});
  }, [loading, products]);

  return (
    <Layout title="Home - Shop Amazing Products in India">
      {/* TOP BIG HERO SLIDER */}
      <div className="relative w-full max-w-7xl mx-auto mt-6 mb-10 px-4 sm:px-6 lg:px-8">
        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* text */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
                <p className="text-xs md:text-sm mb-2 font-semibold uppercase tracking-wide text-orange-300">
                  Desi Deals Specials
                </p>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-3 max-w-xl">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg mb-4 max-w-md text-slate-100">
                  {slide.subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="inline-flex items-center px-5 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-sm md:text-base font-bold shadow-lg"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <button
          type="button"
          onClick={goToPrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-xl"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white text-xl"
        >
          ›
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-orange-500 w-6"
                  : "bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MAIN PAGE CONTENT */}
      <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 via-orange-50 to-emerald-50 dark:bg-slate-900 dark:bg-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero text & buttons (tere original se) */}
          <div className="text-center mb-20">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Link
                to="/categories"
                className="flex-1 px-10 py-5 bg-gradient-to-r from-orange-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center gap-3"
              >
                🗂️ Browse Categories
              </Link>
              <Link
                to="/cart"
                className="flex-1 px-10 py-5 border-4 border-orange-500 text-orange-600 dark:text-orange-300 font-bold text-xl rounded-3xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                🛒 My Cart
              </Link>
            </div>
            <p className="mt-8 text-sm text-orange-600 dark:text-orange-300 font-semibold bg-orange-100 dark:bg-orange-900/40 px-6 py-3 rounded-full inline-block">
              💰 All Prices in INR | Free Shipping on Orders Above ₹999
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-32">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-500 mb-8"></div>
                  <div className="absolute -inset-1 animate-ping rounded-full h-20 w-20 border-2 border-orange-200 opacity-75"></div>
                </div>
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-100 tracking-wide">
                  Loading Desi Products...
                </p>
                <p className="text-lg text-orange-600 dark:text-orange-300 mt-2 font-semibold">
                  Made in India 🇮🇳
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div className="max-w-4xl mx-auto text-center py-32">
              <div className="text-9xl mb-12">📦</div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-slate-50 mb-8 bg-gradient-to-r from-slate-900 to-orange-600 dark:from-slate-100 dark:to-orange-300 bg-clip-text text-transparent">
                No Products Yet!
              </h2>
              <p className="text-2xl text-slate-600 dark:text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto">
                Our store is getting stocked with amazing Indian products. Check
                back soon!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/categories"
                  className="px-12 py-6 bg-gradient-to-r from-orange-500 to-emerald-500 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-3 flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  🗂️ Explore Categories
                </Link>
                <Link
                  to="/"
                  className="px-12 py-6 border-4 border-orange-500 text-orange-600 dark:text-orange-300 font-bold text-xl rounded-3xl hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3"
                >
                  🔄 Refresh
                </Link>
              </div>
            </div>
          )}

          {/* Category sliders */}
          {!loading && products.length > 0 && (
            <div className="space-y-10 mb-16">
              {Object.entries(productsByCategory).map(
                ([categoryName, items]) => (
                  <section key={categoryName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                        {categoryName}
                      </h2>
                      {items[0]?.category?.slug && (
                        <button
                          className="text-sm text-blue-700 dark:text-blue-300 font-semibold hover:underline"
                          onClick={() =>
                            navigate(`/category/${items[0].category.slug}`)
                          }
                        >
                          View all →
                        </button>
                      )}
                    </div>

                    <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                      {items.map((product) => {
                        const cartItem = getCartItem(product._id);
                        const priceINR = formatINR(product.price);
                        const inWishlist = isInWishlist(product._id);

                        const handleAddToCart = () => {
                          if (
                            !requireLogin(
                              "Please login to add items to cart"
                            )
                          )
                            return;

                          if (cartItem) {
                            toast.success("Already in cart");
                            return;
                          }

                          addToCart(product);
                          toast.success("Product added to cart");
                        };

                        return (
                          <div
                            key={product._id}
                            className="min-w-[230px] max-w-[230px] bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-400 hover:-translate-y-2 cursor-pointer"
                            onClick={() =>
                              navigate(`/product/${product.slug}`)
                            }
                          >
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900">
                              <img
                                src={`${API}/api/v1/product/product-photo/${product._id}`}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.target.src = "/placeholder.jpg";
                                }}
                              />

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(product);
                                }}
                                className={`absolute top-2 left-2 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-xl text-sm transition-all
                                  ${
                                    inWishlist
                                      ? "bg-red-600 text-white"
                                      : "bg-slate-800/90 text-white hover:bg-slate-900"
                                  }
                                `}
                              >
                                {inWishlist ? "❤️" : "🤍"}
                              </button>

                              {cartItem && (
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2.5 py-1 rounded-2xl text-[11px] font-bold shadow-2xl flex items-center gap-1.5">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  In Cart ({cartItem.quantity})
                                </div>
                              )}
                            </div>

                            <div
                              className="p-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link
                                to={`/product/${product.slug}`}
                                className="block text-sm font-black text-slate-900 dark:text-slate-50 hover:text-orange-600 dark:hover:text-orange-300 transition-all duration-300 mb-2 line-clamp-2"
                              >
                                {product.name}
                              </Link>

                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                                {product.description?.substring(0, 80)}...
                              </p>

                              <div className="flex items-end justify-between mb-3">
                                <div className="text-left">
                                  <div className="text-xl font-black bg-gradient-to-r from-emerald-500 via-emerald-600 to-orange-500 bg-clip-text text-transparent dark:text-emerald-300 dark:bg-none tracking-tight">
                                    {priceINR}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-through">
                                    MRP: ₹
                                    {(product.price * 1.3).toLocaleString(
                                      "en-IN"
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    navigate(`/product/${product.slug}`)
                                  }
                                  className="text-[10px] text-orange-600 dark:text-orange-300 hover:text-orange-700 dark:hover:text-orange-200 font-bold uppercase tracking-wide"
                                >
                                  Details →
                                </button>
                              </div>

                              {!cartItem ? (
                                <button
                                  onClick={handleAddToCart}
                                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-orange-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-orange-600 text-white font-bold py-2 px-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg text-xs flex items-center justify-center gap-1.5"
                                >
                                  🛒 Add to Cart
                                </button>
                              ) : (
                                <div className="flex items-center bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-2xl p-1.5 shadow-md transition-colors">
                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        product._id,
                                        (cartItem.quantity || 1) - 1
                                      )
                                    }
                                    className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-black text-lg flex items-center justify-center"
                                  >
                                    −
                                  </button>
                                  <span className="mx-2 font-black text-sm text-slate-900 dark:text-slate-50 min-w-[1.8rem] text-center">
                                    {cartItem.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        product._id,
                                        (cartItem.quantity || 1) + 1
                                      )
                                    }
                                    className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-black text-lg flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )
              )}
            </div>
          )}

          {/* Stats section */}
          {!loading && products.length > 0 && (
            <div className="text-center py-20 lg:py-24 border-t-4 border-orange-100 dark:border-orange-900 rounded-3xl bg-gradient-to-r from-orange-50 via-emerald-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 shadow-2xl transition-colors">
              <div className="max-w-4xl mx-auto">
                <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-50 mb-8 bg-gradient-to-r from-orange-600 via-emerald-600 to-orange-700 dark:from-orange-300 dark:via-emerald-300 dark:to-orange-200 bg-clip-text text-transparent">
                  Showing {products.length} Amazing Products
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="p-8 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-xl transition-colors">
                    <div className="text-5xl mb-4">🚚</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      Free Shipping
                    </h3>
                    <p className="text-xl text-emerald-600 dark:text-emerald-300 font-bold">
                      On Orders Above ₹999
                    </p>
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-xl transition-colors">
                    <div className="text-5xl mb-4">🛡️️</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      Secure Checkout
                    </h3>
                    <p className="text-xl text-blue-600 dark:text-blue-300 font-bold">
                      SSL Protected
                    </p>
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-800 backdrop-blur-xl rounded-3xl shadow-xl transition-colors">
                    <div className="text-5xl mb-4">🇮🇳</div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      Made in India
                    </h3>
                    <p className="text-xl text-orange-600 dark:text-orange-300 font-bold">
                      Support Local
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
