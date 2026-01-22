// useCategory.js - Enhanced Professional Version
import { useState, useEffect, useCallback } from "react";
import axios from "../utils/axios";

export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/v1/category/get-category");
      setCategories(Array.isArray(data?.category) ? data.category : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const refetch = useCallback(() => {
    getCategories();
  }, [getCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refetch,
    count: categories.length 
  };
};
