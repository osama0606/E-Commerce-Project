import { useState, useContext, createContext, useEffect, useCallback } from "react";
import { useAuth } from "./auth";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [auth] = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // current user ke liye unique key
  const storageKey = auth?.user?._id
    ? `wishlist_${auth.user._id}`
    : null;

  // login / user change hone par us user ki wishlist load karo
  useEffect(() => {
    if (!storageKey) {
      setWishlist([]);
      return;
    }

    const existingWishlist = localStorage.getItem(storageKey);
    if (existingWishlist) {
      try {
        setWishlist(JSON.parse(existingWishlist));
      } catch (error) {
        console.error("Error parsing wishlist:", error);
        localStorage.removeItem(storageKey);
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [storageKey]);

  // helper: safe write
  const persist = useCallback(
    (items) => {
      setWishlist(items);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
    },
    [storageKey]
  );

  // Add to wishlist
  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);
    if (exists) {
      return false; // Already in wishlist
    }
    const newWishlist = [...wishlist, product];
    persist(newWishlist);
    return true; // Added successfully
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter((item) => item._id !== productId);
    persist(newWishlist);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Clear wishlist (sirf in‑memory, user ka stored data optional)
  const clearWishlist = () => {
    setWishlist([]);
    if (storageKey) {
      // agar bilkul delete karna ho to ye line rakho,
      // agar future login pe bhi wishlist chahiye to is line ko comment kar do.
      // localStorage.removeItem(storageKey);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
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

// Custom hook
const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
