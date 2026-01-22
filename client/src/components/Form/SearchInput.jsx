// SearchInput.jsx
import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = ({ className = "" }) => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keyword = values.keyword?.trim();
    if (!keyword) return;

    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${encodeURIComponent(keyword)}`
      );

      setValues({
        ...values,
        results: Array.isArray(data?.results) ? data.results : [],
      });
      navigate("/search");
    } catch (error) {
      console.log("SEARCH ERROR =>", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex items-stretch">
        <input
          type="search"
          placeholder="Search products..."
          value={values.keyword}
          onChange={(e) =>
            setValues({ ...values, keyword: e.target.value })
          }
          className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 text-sm font-medium rounded-r-lg flex items-center justify-center min-w-[90px]"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
