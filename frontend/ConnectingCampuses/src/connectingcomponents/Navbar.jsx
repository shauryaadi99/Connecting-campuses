import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import LoginForm from "./Login";
import { useAuth } from "../context/AuthContext"; // make sure this path is correct
import { logout } from "./Login";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const modalRef = useRef(null);

  const { user, setUser, logout: logoutFn, loading } = useAuth();

  console.log("AuthContext user:", user);
  console.log("AuthContext setUser:", setUser);
  // get user and setter from context

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        {/* Simple spinner SVG or any loading UI */}
        <svg
          className="animate-spin h-6 w-6 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  const navLinks = [
    { href: "#newsroom", label: "Newsroom" },
    { href: "#lostfound", label: "Lost & Found" },
    { href: "#carpooling", label: "Carpooling" },
    { href: "#sellbuy", label: "Sell & Buy" },
    { href: "/attendance", label: "My Attendance" },
  ];

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // update user in context on login success
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout(logoutFn); // ✅ this clears both context + localStorage

    navigate("/");
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();

    if (href === "/attendance" && !user) {
      toast.error("Please login to view and track your attendance.");
      return;
    }

    const isHash = href.startsWith("#");

    if (isHash) {
      const sectionId = href.slice(1);
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: sectionId } });
      } else {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";
  }, [showLogin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showLogin &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setShowLogin(false);
      }
    };
    const handleEscape = (e) => e.key === "Escape" && setShowLogin(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showLogin]);

  const LoginOrProfileButton = user ? (
    <div className="relative flex items-center space-x-2">
      <FiUser
        onClick={() => navigate("/profile")}
        className="w-10 h-10 p-2 text-indigo-600 bg-white rounded-full border border-indigo-200 shadow-md cursor-pointer hover:bg-indigo-600 hover:text-white hover:scale-110 transform transition"
        title="Go to Profile"
      />
      <button
        onClick={handleLogout}
        className="ml-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
        title="Logout"
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={() => setShowLogin(true)}
      className="relative group p-[3px]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-6 py-2 bg-black rounded-[6px] relative text-white hover:bg-transparent transition">
        Login
      </div>
    </button>
  );

  return (
    <>
      <Toaster />

      <nav className="fixed w-full z-50 bg-white/30 backdrop-blur-lg shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-orange-500 hover:text-orange-600 transition"
            >
              ConnectingCampuses
            </a>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center space-x-5 md:space-x-8 whitespace-nowrap">
              {navLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-orange-500 transition hover:scale-105"
                >
                  {label}
                </a>
              ))}
              {LoginOrProfileButton}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-orange-500 p-2"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="sm:hidden fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-orange-100 animate-slideDown z-40">
            <div className="flex flex-col px-6 py-5 space-y-4 text-center">
              {navLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-base font-medium text-gray-800 hover:text-orange-600 transition"
                >
                  {label}
                </a>
              ))}
              <div className="flex justify-center mt-4">
                {LoginOrProfileButton}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-10%);
            }
            100% {
              opacity: 1;
              transform: translateY(0%);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:px-6 md:px-8">
            <div
              ref={modalRef}
              className="relative w-full max-w-md sm:max-w-lg bg-black bg-opacity-90 rounded-lg shadow-xl p-6 sm:p-8 md:p-10"
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-3 right-4 text-white text-3xl leading-none hover:text-amber-500 transition"
                aria-label="Close login modal"
              >
                &times;
              </button>
              <LoginForm
                onLoginSuccess={() => setShowLogin(false)}
                onClose={() => setShowLogin(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
