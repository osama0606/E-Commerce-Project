// client/src/context/cart.jsx
import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/axios";
import { useAuth } from "./auth";

const CartContext = createContext();
const CART_KEY = "cart";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth] = useAuth();
  const [loadingCart, setLoadingCart] = useState(false);

  // login / logout change pe cart handle
  useEffect(() => {
    // user logout ya token nahi => cart full clear
    if (!auth?.token) {
      setCart([]);
      localStorage.removeItem(CART_KEY);
      setLoadingCart(false);
      return;
    }

    let isMounted = true;
    setLoadingCart(true);

    const loadCart = async () => {
      try {
        // 1) Backend se fresh cart fetch
        const { data } = await api.get("/api/v1/cart");
        if (isMounted && data?.success && Array.isArray(data.cart)) {
          if (data.cart.length > 0) {
            // Backend has items, use them
            const normalized = data.cart
              .filter(i => i.product) // Extra safety
              .map((i) => ({
                _id: i.product._id,
                name: i.product.name,
                price: i.product.price,
                description: i.product.description,
                quantity: i.quantity,
              }));
            setCart(normalized);
            localStorage.setItem(CART_KEY, JSON.stringify(normalized));
          } else {
            // Backend empty, check localStorage for guest cart
            const existing = localStorage.getItem(CART_KEY);
            if (existing) {
              try {
                const parsed = JSON.parse(existing);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setCart(parsed);
                  // Save guest cart to backend
                  persist(parsed);
                } else {
                  setCart([]);
                  localStorage.setItem(CART_KEY, JSON.stringify([]));
                }
              } catch {
                setCart([]);
                localStorage.removeItem(CART_KEY);
              }
            } else {
              setCart([]);
            }
          }
        } else {
          // Invalid response, fallback to localStorage
          if (isMounted) {
            const existing = localStorage.getItem(CART_KEY);
            if (existing) {
              try {
                const parsed = JSON.parse(existing);
                if (Array.isArray(parsed)) {
                  setCart(parsed);
                } else {
                  setCart([]);
                }
              } catch {
                setCart([]);
                localStorage.removeItem(CART_KEY);
              }
            } else {
              setCart([]);
            }
          }
        }
      } catch (err) {
        console.error("Error loading cart from server", err);

        // Fallback: localStorage se, but sirf agar valid array hai
        if (isMounted) {
          const existing = localStorage.getItem(CART_KEY);
          if (existing) {
            try {
              const parsed = JSON.parse(existing);
              if (Array.isArray(parsed)) {
                setCart(parsed);
              } else {
                setCart([]);
                localStorage.removeItem(CART_KEY);
              }
            } catch {
              setCart([]);
              localStorage.removeItem(CART_KEY);
            }
          } else {
            setCart([]);
          }
        }
      } finally {
        if (isMounted) setLoadingCart(false);
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [auth?.token]);

  const persist = useCallback(
    async (items) => {
      // in‑memory update
      setCart(items);

      // localStorage update (guest + logged‑in dono ke liye)
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (err) {
        console.error("Error saving cart to localStorage", err);
      }

      // backend sync only when logged in
      if (auth?.token) {
        try {
          const payload = {
            items: items.map((item) => ({
              product: item._id,
              quantity: item.quantity || 1,
            })),
          };
          await api.post("/api/v1/cart", payload);
        } catch (err) {
          console.error("Error saving cart to server", err);
        }
      }
    },
    [auth?.token]
  );

  const addToCart = useCallback(
    (product) => {
      if (!product?._id) return;

      const existing = cart.find((i) => i._id === product._id);
      let next;
      if (existing) {
        next = cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        next = [...cart, { ...product, quantity: 1 }];
      }
      persist(next);
    },
    [cart, persist]
  );

  const updateCartItemQuantity = useCallback(
    (id, qty) => {
      let next;
      if (qty <= 0) {
        next = cart.filter((item) => item._id !== id);
      } else {
        next = cart.map((item) =>
          item._id === id ? { ...item, quantity: qty } : item
        );
      }
      persist(next);
    },
    [cart, persist]
  );

  const removeCartItem = useCallback(
    (id) => {
      const next = cart.filter((item) => item._id !== id);
      persist(next);
    },
    [cart, persist]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingCart,
        addToCart,
        removeCartItem,
        updateCartItemQuantity,
        clearCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
