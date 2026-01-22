import { useState, useContext, createContext, useEffect, useCallback } from "react";

const CartContext = createContext();
const CART_KEY = "cart";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem(CART_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      }
    } catch (err) {
      console.error("Error loading cart from localStorage", err);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage", err);
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    if (!product?._id) return;

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateCartItemQuantity = useCallback((id, qty) => {
    setCart((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item._id !== id);
      }
      return prev.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      );
    });
  }, []);

  const removeCartItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeCartItem,
        updateCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
