import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./auth";
import api from "../utils/axios";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [auth] = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (!auth?.token) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const res = await api.get("/api/v1/wishlist");
        if (res?.data?.success && Array.isArray(res.data.wishlist)) {
          // Normalize: extract product objects
          const normalized = res.data.wishlist.map(item => item.product);
          setWishlist(normalized);
        }
      } catch (error) {
        console.error("Fetch wishlist error:", error);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [auth?.token]);

  const persist = useCallback(
    async (items) => {
      setWishlist(items);

      if (auth?.token) {
        try {
          await api.post("/api/v1/wishlist", {
            items: items.map((p) => ({ product: p._id })),
          });
        } catch (error) {
          console.error("Save wishlist error:", error);
        }
      }
    },
    [auth?.token]
  );

  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);
    if (exists) return false;
    const next = [...wishlist, product];
    persist(next);
    return true;
  };

  const removeFromWishlist = (productId) => {
    const next = wishlist.filter((item) => item._id !== productId);
    persist(next);
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);

  const clearWishlist = () => {
    persist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loadingWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
