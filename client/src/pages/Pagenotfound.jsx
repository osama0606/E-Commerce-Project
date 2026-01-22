import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./../components/Layout/Layout";

const Pagenotfound = () => {
  const navigate = useNavigate();

  return (
    <Layout title="404 - Page Not Found">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="text-center max-w-2xl">
          {/* ANIMATED 404 NUMBER */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse">
              404
            </h1>
          </div>

          {/* MAIN HEADING */}
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            Oops! Page Not Found
          </h2>

          {/* DESCRIPTION */}
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4 leading-relaxed transition-colors">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, we'll help you get back on track!
          </p>

          {/* ERROR ICON */}
          <div className="my-8">
            <div className="text-8xl">😕</div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🏠 Go Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              ↩️ Go Back
            </button>
          </div>

          {/* QUICK NAVIGATION */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 mb-8 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
              Quick Navigation
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/"
                className="p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition border border-slate-200 dark:border-slate-800 dark:hover:border-blue-600"
              >
                <div className="text-2xl mb-2">🛍️</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  Shop
                </p>
              </Link>

              <Link
                to="/about"
                className="p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition border border-slate-200 dark:border-slate-800 dark:hover:border-blue-600"
              >
                <div className="text-2xl mb-2">ℹ️</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  About
                </p>
              </Link>

              <Link
                to="/contact"
                className="p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition border border-slate-200 dark:border-slate-800 dark:hover:border-blue-600"
              >
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  Contact
                </p>
              </Link>

              <Link
                to="/categories"
                className="p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition border border-slate-200 dark:border-slate-800 dark:hover:border-blue-600"
              >
                <div className="text-2xl mb-2">📂</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  Categories
                </p>
              </Link>
            </div>
          </div>

          {/* HELP SECTION */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 p-6 rounded-lg transition-colors">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 transition-colors">
              Need Help?
            </h4>
            <p className="text-slate-700 dark:text-slate-300 mb-4 transition-colors">
              If you believe this is an error, please contact our support team.
            </p>
            <a
              href="mailto:support@ecommerce.com"
              className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              📧 support@ecommerce.com
            </a>
          </div>

          {/* FOOTER NOTE */}
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-8 transition-colors">
            Error Code: 404 | Not Found
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
