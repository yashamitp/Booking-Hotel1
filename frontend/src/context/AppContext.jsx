import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axiosClient from "../api/axiosClient";

export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", rate: 1, label: "INR (₹)" },
  USD: { code: "USD", symbol: "$", rate: 0.012, label: "USD ($)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.011, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.0095, label: "GBP (£)" },
  AED: { code: "AED", symbol: "AED ", rate: 0.044, label: "AED" },
  JPY: { code: "JPY", symbol: "¥", rate: 1.82, label: "JPY (¥)" },
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const ADMIN_EMAIL = "yashprajapati.9769@gmail.com";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const isAdmin =
    isLoaded &&
    (user?.publicMetadata?.role === "admin" || userEmail === ADMIN_EMAIL);

  // ── Hotel Owner Permission State ───────────────────────────────────────────
  // Dashboard only appears after getting permission of posting hotels (admin approval)
  const [hasHotelPermission, setHasHotelPermission] = useState(false);
  const [userHotels, setUserHotels] = useState([]);
  const [checkingPermission, setCheckingPermission] = useState(true);

  const checkHotelPermission = async () => {
    if (!user) {
      setHasHotelPermission(false);
      setUserHotels([]);
      setCheckingPermission(false);
      return;
    }
    if (isAdmin) {
      setHasHotelPermission(true);
      setCheckingPermission(false);
      return;
    }
    try {
      setCheckingPermission(true);
      const res = await axiosClient.get(`/hotels/api/owner/${user.id}`);
      const hotels = Array.isArray(res.data) ? res.data : [];
      setUserHotels(hotels);
      // User has permission if they have at least one hotel approved by admin
      const hasApproved = hotels.some((h) => h.status === "approved");
      setHasHotelPermission(hasApproved);
    } catch (e) {
      console.error("Error checking hotel permission:", e);
      setHasHotelPermission(false);
    } finally {
      setCheckingPermission(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      checkHotelPermission();
    }
  }, [user?.id, isAdmin, isLoaded]);

  // ── Wishlist State ──────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("quickstay_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("quickstay_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlist]);

  const toggleWishlist = (roomId) => {
    setWishlist((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const isWishlisted = (roomId) => wishlist.includes(roomId);

  // ── Multi-Currency State ───────────────────────────────────────────────────
  const [currencyCode, setCurrencyCode] = useState(() => {
    try {
      return localStorage.getItem("quickstay_currency") || "INR";
    } catch {
      return "INR";
    }
  });

  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code);
      try {
        localStorage.setItem("quickstay_currency", code);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `${currency.symbol}0`;
    }
    const converted = Math.round(Number(amount) * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  // ── Stays Comparison System ────────────────────────────────────────────────
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem("quickstay_compare");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("quickstay_compare", JSON.stringify(compareList));
    } catch (e) {
      console.error("Failed to save comparison list:", e);
    }
  }, [compareList]);

  const addToCompare = (room) => {
    if (!room || !room._id) return;
    setCompareList((prev) => {
      if (prev.some((r) => r._id === room._id)) return prev;
      if (prev.length >= 4) {
        alert("You can compare up to 4 stays at a time.");
        return prev;
      }
      return [...prev, room];
    });
  };

  const removeFromCompare = (roomId) => {
    setCompareList((prev) => prev.filter((r) => r._id !== roomId));
  };

  const isInCompare = (roomId) => compareList.some((r) => r._id === roomId);

  const clearCompare = () => setCompareList([]);

  // ── Recently Viewed Stays ──────────────────────────────────────────────────
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem("quickstay_recent");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addRecentlyViewed = (room) => {
    if (!room || !room._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r._id !== room._id);
      const updated = [room, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("quickstay_recent", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // ── Hotel Registration Modal State ─────────────────────────────────────────
  const [isHotelRegOpen, setIsHotelRegOpen] = useState(false);
  const openHotelReg = () => setIsHotelRegOpen(true);
  const closeHotelReg = () => setIsHotelRegOpen(false);

  return (
    <AppContext.Provider
      value={{
        isAdmin,
        isLoaded,
        user,
        userEmail,
        // Hotel posting permission
        hasHotelPermission,
        checkHotelPermission,
        userHotels,
        checkingPermission,
        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
        // Currency
        currency,
        currencyCode,
        changeCurrency,
        formatPrice,
        // Comparison
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        // Recently Viewed
        recentlyViewed,
        addRecentlyViewed,
        // Hotel Registration Modal
        isHotelRegOpen,
        openHotelReg,
        closeHotelReg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
