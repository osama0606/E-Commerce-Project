import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 py-8 mt-16 border-t border-slate-800 dark:border-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: brand + small text */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-sm font-semibold text-slate-100">
            TajSouq
          </p>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} TajSouq. All rights reserved.
          </p>
        </div>

        {/* Center: links */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <Link
            to="/about"
            className="hover:text-slate-100 transition-colors"
          >
            About
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            to="/contact"
            className="hover:text-slate-100 transition-colors"
          >
            Contact
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            to="/policy"
            className="hover:text-slate-100 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Right: credit */}
        <div className="text-center md:text-right text-xs text-slate-400">
          Built with <span className="text-red-400">❤️</span> by{" "}
          <span className="font-semibold text-slate-200">Osama Khan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
