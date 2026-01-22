import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 dark:from-slate-950 to-slate-100 dark:to-slate-900 px-4 transition-colors">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto shadow-xl dark:shadow-2xl"></div>
        <h1 className="text-4xl font-playfair font-bold text-slate-900 dark:text-white mb-4">
          Redirecting...
        </h1>
        <p className="text-2xl text-slate-600 dark:text-slate-400 font-semibold">
          {count} seconds remaining
        </p>
        <div className="w-32 h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 dark:from-blue-400 to-slate-900 dark:to-slate-700 rounded-full transition-all duration-1000"
            style={{ width: `${(4-count)/4 * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
