import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext, CURRENCIES } from "../context/AppContext";

const BookIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);
const HeartNavIcon = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const UserMenu = ({ navigate }) => (
  <UserButton>
    <UserButton.MenuItems>
      <UserButton.Action
        label="My Bookings"
        labelIcon={BookIcon}
        onClick={() => navigate("/my-bookings")}
      />
      <UserButton.Action
        label="Wishlist"
        labelIcon={HeartNavIcon}
        onClick={() => navigate("/wishlist")}
      />
    </UserButton.MenuItems>
  </UserButton>
);

const Navbar = () => {
  const {
    isAdmin,
    wishlistCount,
    currencyCode,
    changeCurrency,
    openHotelReg,
    compareList,
    setIsCompareModalOpen,
  } = useAppContext();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Wishlist", path: "/wishlist", badge: wishlistCount },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10 || location.pathname !== "/");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navStyle = isScrolled
    ? "bg-white/95 shadow-md py-3 text-gray-800 backdrop-blur-md"
    : "py-5 text-black";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-12 lg:px-20 xl:px-28 ${navStyle}`}
    >
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="QuickStay"
            className={`h-9 transition-all ${isScrolled && "invert opacity-85"}`}
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                className="group relative flex items-center gap-1.5 text-sm"
              >
                <span
                  className={`transition ${
                    active
                      ? "font-bold text-blue-600"
                      : "opacity-85 hover:opacity-100 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </span>

                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="text-[10px] font-bold bg-red-500 text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}

                <span
                  className={`absolute left-0 -bottom-1 h-0.5 transition-all duration-300 ${
                    active
                      ? "w-full bg-blue-600"
                      : "w-0 bg-blue-600 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* List Property / Partner Button */}
          <button
            onClick={openHotelReg}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300/80 hover:border-gray-900 transition cursor-pointer"
          >
            + List Property
          </button>

          {/* Owner Dashboard link */}
          {isAdmin && (
            <button
              onClick={() => navigate("/owner")}
              className="border border-black px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black hover:text-white transition cursor-pointer"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currencyCode}
              onChange={(e) => changeCurrency(e.target.value)}
              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-2 py-1.5 border border-transparent hover:border-gray-300 transition cursor-pointer outline-none"
              aria-label="Select Currency"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Trigger Button (if any) */}
          {compareList && compareList.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="relative p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
              title="Compare Stays"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-blue-600 text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Search Shortcut */}
          <button
            onClick={() => navigate("/rooms")}
            aria-label="Search Hotels"
            className="p-1 cursor-pointer"
          >
            <img
              src={assets.searchIcon}
              alt="search"
              className={`h-5 w-5 transition ${isScrolled && "invert"}`}
            />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative p-1 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 transition ${
                isScrolled ? "text-gray-800" : "text-black"
              } hover:text-red-500`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-red-500 text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User / Login */}
          {user ? (
            <UserMenu navigate={navigate} />
          ) : (
            <button
              onClick={() => openSignIn()}
              className={`px-6 py-2 text-xs font-semibold rounded-full transition cursor-pointer ${
                isScrolled ? "bg-black text-white hover:bg-gray-800" : "bg-black text-white"
              }`}
            >
              Sign In
            </button>
          )}
        </div>

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center gap-3">
          <select
            value={currencyCode}
            onChange={(e) => changeCurrency(e.target.value)}
            className="text-[11px] font-semibold bg-gray-100 text-gray-800 rounded px-1.5 py-1 outline-none"
          >
            {Object.keys(CURRENCIES).map((code) => (
              <option key={code} value={code}>
                {CURRENCIES[code].symbol}
              </option>
            ))}
          </select>

          {user && <UserMenu navigate={navigate} />}
          <img
            src={assets.menuIcon}
            alt="menu"
            onClick={() => setIsMenuOpen(true)}
            className={`h-5 cursor-pointer ${isScrolled && "invert"}`}
          />
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 text-base transition-transform duration-300 md:hidden z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-5 right-5 p-2 text-xl font-bold"
        >
          ✕
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="font-medium text-gray-800 hover:text-blue-600"
          >
            {link.name} {typeof link.badge === "number" && link.badge > 0 && `(${link.badge})`}
          </Link>
        ))}

        <button
          onClick={() => {
            setIsMenuOpen(false);
            openHotelReg();
          }}
          className="text-sm font-semibold text-blue-600"
        >
          + List Your Property
        </button>

        {!user ? (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              openSignIn();
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-medium"
          >
            Sign In
          </button>
        ) : (
          isAdmin && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/owner");
              }}
              className="border px-5 py-2 rounded-full text-sm font-medium"
            >
              Dashboard
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
