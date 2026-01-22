import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="
          w-full px-4 py-3 rounded-lg
          border border-slate-300 dark:border-slate-600
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          transition-colors
        "
        placeholder="Enter category name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        type="submit"
        className="
          w-full py-3 rounded-lg font-semibold text-sm tracking-wide
          bg-blue-600 hover:bg-blue-700
          dark:bg-blue-600 dark:hover:bg-blue-700
          text-white
          transition-colors
        "
      >
        SUBMIT
      </button>
    </form>
  );
};

export default CategoryForm;
