import React, { useState, useContext } from "react";
// react-router-dom se Link aur useLocation ko import karein
import { Link, useLocation } from "react-router-dom";
// Apne UserContext ko import karein (path check kar lein)
import { userDataContext } from "../context/UserContext"; // <-- PATH THEEK KIYA GAYA HAI
// Icons ke liye (npm install lucide-react)
import { Leaf, User, Menu, X } from "lucide-react";

function Navbar() {
  // Mobile menu ko show/hide karne ke liye state
  const [showMenu, setShowMenu] = useState(false);

  // Auth state ke liye context
  const { user, loading } = useContext(userDataContext);

  // Active page ka pata lagane ke liye
  const location = useLocation();
  const currentPath = location.pathname;

  // Aapke app ke links
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Find Doctors", path: "/doctors" },
    { title: "Lab Report Summarizer", path: "/report" },
  ];

  // Links ko render karne ke liye helper component
  const renderNavLinks = (isMobile = false) => (
    <nav
      className={
        isMobile
          ? "flex flex-col gap-6"
          : "hidden md:flex items-center gap-6 lg:gap-8"
      }
    >
      {navLinks.map((link) => (
        <Link
          key={link.title}
          to={link.path}
          onClick={() => isMobile && setShowMenu(false)} // Mobile menu band karein
          className={`
            font-medium transition-colors
            ${isMobile ? "text-2xl text-gray-700" : ""}
            ${
              currentPath === link.path
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          `}
        >
          {link.title}
          {/* Active link ke neeche underline (sirf desktop par) */}
          {!isMobile && currentPath === link.path && (
            <span className="block h-0.5 w-1/2 mx-auto bg-blue-600 mt-1"></span>
          )}
        </Link>
      ))}
    </nav>
  );

  // Auth buttons ko render karne ke liye helper component
  const renderAuthSection = (isMobile = false) => (
    <div
      className={isMobile ? "flex flex-col gap-4" : "flex items-center gap-3"}
    >
      {loading ? (
        // Loading state (layout shift se bachne ke liye)
        <div className="h-10 w-28 animate-pulse bg-gray-200 rounded-full"></div>
      ) : user ? (
        // --- User Logged In ---
        <Link
          to="/profile"
          className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
          onClick={() => isMobile && setShowMenu(false)}
        >
          <span className="font-semibold text-gray-700 hidden sm:inline">
            My Account
          </span>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="h-5 w-5" />
          </div>
        </Link>
      ) : (
        // --- User Logged Out ---
        <>
          <Link
            to="/login"
            onClick={() => isMobile && setShowMenu(false)}
            className={`
              font-semibold text-sm rounded-full transition-colors
              ${
                isMobile
                  ? "w-full text-center py-3 bg-gray-100 text-blue-600"
                  : "bg-white text-blue-600 border border-blue-600 px-5 py-2 hover:bg-gray-100"
              }
            `}
          >
            Log In
          </Link>
          <Link
            to="/register"
            onClick={() => isMobile && setShowMenu(false)}
            className={`
              font-semibold text-sm rounded-full transition-colors
              ${
                isMobile
                  ? "w-full text-center py-3 bg-blue-600 text-white"
                  : "bg-blue-600 text-white px-5 py-2 hover:bg-blue-700"
              }
            `}
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );

  return (
    // Page ke background ko halka grey rakhein (image jaisa)
    <div className=" p-4 w-full fixed z-40 ">
      {/* Asli Navbar container (rounded, shadow) */}
      <header className="max-w-7xl mx-auto bg-white rounded-full shadow-lg flex items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-500" />
          <span className="text-xl font-bold text-gray-800">MediFind</span>
        </Link>

        {/* Desktop Links (Center mein) */}
        {renderNavLinks()}

        {/* Desktop Auth Buttons (Right mein) */}
        <div className="hidden md:flex">{renderAuthSection()}</div>

        {/* --- Mobile Menu Button (Hamburger) --- */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 text-gray-700"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* --- Mobile Menu (Fullscreen Overlay) --- */}
      {showMenu && (
        <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 text-gray-700"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col items-center gap-8 mb-12">
            {renderNavLinks(true)}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col items-center gap-4">
            {renderAuthSection(true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
