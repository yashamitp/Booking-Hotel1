import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

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
  const { isAdmin, wishlistCount } = useAppContext();

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

    handleScroll(); // run on route change
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  /* ================= STYLES ================= */

  const navStyle = isScrolled
    ? "bg-white/90 shadow-md py-3 text-gray-700"
    : "py-5 text-black";

  /* ================= JSX ================= */

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-16 lg:px-24 xl:px-32 ${navStyle}`}
    >
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-9 transition-all ${isScrolled && "invert opacity-80"}`}
          />
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link key={link.name} to={link.path} className="group relative flex items-center gap-1.5">
                <span
                  className={`transition ${
                    active
                      ? "font-semibold"
                      : "opacity-80 group-hover:opacity-100"
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
                      ? "w-full bg-current"
                      : "w-0 bg-current group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => navigate("/owner")}
              className="border px-4 py-1.5 rounded-full text-sm hover:bg-black hover:text-white transition cursor-pointer"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4">
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

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative p-1 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 transition ${
                isScrolled ? "text-gray-800" : "text-white"
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

          {user ? (
            <UserMenu navigate={navigate} />
          ) : (
            <button
              onClick={() => openSignIn()}
              className={`px-8 py-2.5 rounded-full transition ${
                isScrolled ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex items-center gap-3">
          {user && <UserMenu navigate={navigate} />}
          <img
            src={assets.menuIcon}
            alt="menu"
            onClick={() => setIsMenuOpen(true)}
            className={`h-4 cursor-pointer ${isScrolled && "invert"}`}
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 text-lg transition-transform duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-5 right-5"
        >
          <img src={assets.closeIcon} alt="close" className="h-6" />
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {!user ? (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              openSignIn();
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        ) : (
          isAdmin && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/owner");
              }}
              className="border px-4 py-2 rounded-full"
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
