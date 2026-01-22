import { useState, useContext, createContext } from "react";

const SearchContext = createContext(null);

const SearchProvider = ({ children }) => {
  const [values, setValues] = useState({
    keyword: "",
    results: [], // ✅ always array
  });

  return (
    <SearchContext.Provider value={[values, setValues]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export { useSearch, SearchProvider };
