// client/src/components/Layout/Header.jsx
import React, { useState, useCallback } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { useTheme } from "../../context/theme";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { useCategory } from "../../hooks/useCategory";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const { cart, clearCart, loadingCart } = useCart();
  const { wishlist, loadingWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { categories, loading } = useCategory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    clearCart();
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  }, [auth, setAuth, clearCart, navigate]);

  // Counts – hamesha current state se, loading ho to bhi latest length
  const cartCount = loadingCart ? 0 : (Array.isArray(cart) ? cart.length : 0);
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-md">
                  <span className="text-sm font-extrabold tracking-[0.18em] text-white dark:text-slate-900">
                    TS
                  </span>
                </div>
                <div className="leading-tight hidden sm:block">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    TajSouq
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    India ka Royal Online Bazaar
                  </p>
                </div>
              </Link>
            </div>

            {/* Center nav – desktop */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-amber-400"
                      : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400"
                  }`
                }
              >
                Home
              </NavLink>

              {/* Categories */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400 transition-colors">
                  Categories
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute mt-2 w-64 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/categories"
                    className="block px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800"
                  >
                    All categories
                  </Link>
                  <div className="max-h-72 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        Loading...
                      </div>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((c) => (
                        <Link
                          key={c._id}
                          to={`/category/${c.slug}`}
                          className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {c.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        No categories
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-amber-400"
                      : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400"
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-amber-400"
                      : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400"
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* SEARCH – center column, desktop only */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <div className="w-full max-w-md">
                <div className="rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <SearchInput
                    className="
                      [&>div>input]:px-3
                      [&>div>input]:py-2
                      [&>div>input]:bg-transparent
                      [&>div>input]:text-sm
                      [&>div>input]:text-slate-900
                      [&>div>input]:placeholder:text-slate-500
                      [&>div>button]:px-4
                      [&>div>button]:text-sm
                      [&>div>button]:font-medium
                      [&>div>button]:bg-blue-600
                      [&>div>button]:hover:bg-blue-700
                      [&>div>button]:text-white

                      dark:[&>div>input]:text-slate-100
                      dark:[&>div>input]:placeholder:text-slate-400
                      dark:[&>div>button]:bg-blue-500
                      dark:[&>div>button]:hover:bg-blue-600
                    "
                  />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌜" : "🌞"}
              </button>

              {/* Wishlist – only when logged in */}
              {auth?.user && (
                <NavLink to="/wishlist" className="hidden sm:inline-block">
                  <Badge
                    count={wishlistCount}
                    size="small"
                    style={{ backgroundColor: "#f97373" }}
                  >
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 transition-colors">
                      ❤️
                    </button>
                  </Badge>
                </NavLink>
              )}

              {/* Cart */}
              <NavLink to="/cart">
                <Badge
                  count={cartCount}
                  size="small"
                  style={{ backgroundColor: "#10b981" }}
                >
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    🛒
                  </button>
                </Badge>
              </NavLink>

              {/* Auth */}
              {!auth?.user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign up
                  </NavLink>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <NavLink
                    to={`/dashboard/${
                      Number(auth?.user?.role) === 1 ? "admin" : "user"
                    }`}
                    className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              >
                {menuOpen ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 pb-4">
              <div className="pt-3 pb-2">
                <div className="rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <SearchInput
                    className="
                      [&>div>input]:px-3
                      [&>div>input]:py-2
                      [&>div>input]:bg-transparent
                      [&>div>input]:text-sm
                      [&>div>input]:text-slate-900
                      [&>div>input]:placeholder:text-slate-500
                      [&>div>button]:px-4
                      [&>div>button]:text-sm
                      [&>div>button]:font-medium
                      [&>div>button]:bg-blue-600
                      [&>div>button]:hover:bg-blue-700
                      [&>div>button]:text-white

                      dark:[&>div>input]:text-slate-100
                      dark:[&>div>input]:placeholder:text-slate-400
                      dark:[&>div>button]:bg-blue-500
                      dark:[&>div>button]:hover:bg-blue-600
                    "
                  />
                </div>
              </div>
              <nav className="space-y-1 text-sm">
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                >
                  Home
                </NavLink>

                <button
                  onClick={() => setCategoryOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-1 py-2 text-slate-800 dark:text-slate-100"
                >
                  <span>Categories</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {categoryOpen && (
                  <div className="pl-2 space-y-1">
                    <NavLink
                      to="/categories"
                      onClick={() => setMenuOpen(false)}
                      className="block px-1 py-1.5 text-slate-700 dark:text-slate-200"
                    >
                      All categories
                    </NavLink>
                    {Array.isArray(categories) &&
                      categories.map((c) => (
                        <NavLink
                          key={c._id}
                          to={`/category/${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="block px-1 py-1.5 text-slate-700 dark:text-slate-200"
                        >
                          {c.name}
                        </NavLink>
                      ))}
                  </div>
                )}

                <NavLink
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                >
                  Contact
                </NavLink>

                {auth?.user && (
                  <NavLink
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                  >
                    Wishlist ({wishlistCount})
                  </NavLink>
                )}
                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                >
                  Cart ({cartCount})
                </NavLink>

                {!auth?.user ? (
                  <div className="pt-2 space-y-1 border-t border-gray-200 dark:border-slate-800 mt-2">
                    <NavLink
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                    >
                      Sign in
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block px-1 py-2 text-blue-600 dark:text-amber-400"
                    >
                      Create account
                    </NavLink>
                  </div>
                ) : (
                  <div className="pt-2 space-y-1 border-t border-gray-200 dark:border-slate-800 mt-2">
                    <NavLink
                      to={`/dashboard/${
                        Number(auth?.user?.role) === 1 ? "admin" : "user"
                      }`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-1 py-2 text-slate-800 dark:text-slate-100"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-1 py-2 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* spacer */}
      <div className="h-16" />
    </>
  );
};

export default Header;
