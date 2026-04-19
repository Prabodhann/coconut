import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { UI_CONTENT } from "@/constants/uiContent";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

interface NavbarProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [activeMenu, setActiveMenu] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { list: foodList } = useAppSelector((state) => state.food);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: UI_CONTENT.NAVBAR.HOME, path: "/", id: "home" },
    { name: UI_CONTENT.NAVBAR.MENU, path: "#explore-menu", id: "menu" },
    {
      name: UI_CONTENT.NAVBAR.MOBILE_APP,
      path: "#app-download",
      id: "mob-app",
    },
    { name: UI_CONTENT.NAVBAR.CONTACT_US, path: "#footer", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-2 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setActiveMenu("home")}
          className="flex items-center gap-2 group"
        >
          <motion.div layout className="flex items-center">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">
              {UI_CONTENT.NAVBAR.LOGO_PREFIX}
            </span>
            <AnimatePresence mode="wait">
              {!isScrolled && (
                <motion.span
                  key="logo-text"
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -10, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-2xl md:text-3xl font-extrabold tracking-tighter text-zinc-900 dark:text-white overflow-hidden whitespace-nowrap"
                >
                  {UI_CONTENT.NAVBAR.LOGO_EXPANDED}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              layout
              className="text-orange-500 text-2xl md:text-3xl font-bold ml-0.5"
            >
              .
            </motion.span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex items-center gap-8 text-zinc-600 dark:text-zinc-300 font-medium tracking-wide transition-all duration-300 ${isScrolled ? "text-sm" : "text-base"}`}
        >
          {navLinks.map((link) => (
            <li key={link.id}>
              {link.path.startsWith("#") ? (
                <a
                  href={link.path}
                  onClick={() => setActiveMenu(link.id)}
                  className={`hover:text-orange-500 transition-colors relative pb-1 ${activeMenu === link.id ? "text-orange-500" : ""}`}
                >
                  {link.name}
                  {activeMenu === link.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </a>
              ) : (
                <Link
                  to={link.path}
                  onClick={() => setActiveMenu(link.id)}
                  className={`hover:text-orange-500 transition-colors relative pb-1 ${activeMenu === link.id ? "text-orange-500" : ""}`}
                >
                  {link.name}
                  {activeMenu === link.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle />
          <Link to="/cart" className="relative group p-2">
            <ShoppingBag
              className={`text-zinc-700 dark:text-zinc-300 group-hover:text-orange-500 transition-all duration-300 ${isScrolled ? "w-5 h-5" : "w-6 h-6"}`}
            />
            {getTotalCartAmount() > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-black" />
            )}
          </Link>

          {!token ? (
            <Button
              onClick={() => setShowLogin(true)}
              variant="default"
              className={`hidden md:inline-flex bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full transition-all duration-300 ease-in-out ${
                isScrolled ? "w-10 h-10 p-0 justify-center" : "px-6 h-10"
              }`}
            >
              {isScrolled ? (
                <User className="w-5 h-5" />
              ) : (
                UI_CONTENT.NAVBAR.SIGN_IN
              )}
            </Button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 focus:outline-none"
              >
                <div
                  className={`rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border border-orange-200 dark:border-orange-800 transition-all duration-300 ${isScrolled ? "w-8 h-8" : "w-9 h-9"}`}
                >
                  <User
                    className={`${isScrolled ? "w-4 h-4" : "w-5 h-5"} text-orange-600 dark:text-orange-400`}
                  />
                </div>
                {!isScrolled && (
                  <ChevronDown className="w-4 h-4 text-zinc-500 hidden md:block" />
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-2 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" />{" "}
                      {UI_CONTENT.NAVBAR.PROFILE}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/myorders");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-zinc-400" />{" "}
                      {UI_CONTENT.NAVBAR.ORDERS}
                    </button>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> {UI_CONTENT.NAVBAR.LOGOUT}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.id}>
                  {link.path.startsWith("#") ? (
                    <a
                      href={link.path}
                      onClick={() => {
                        setActiveMenu(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-xl font-medium block py-2 transition-colors ${
                        activeMenu === link.id
                          ? "text-orange-500"
                          : "text-zinc-600 dark:text-zinc-300 hover:text-orange-500"
                      }`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => {
                        setActiveMenu(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-xl font-medium block py-2 transition-colors ${
                        activeMenu === link.id
                          ? "text-orange-500"
                          : "text-zinc-600 dark:text-zinc-300 hover:text-orange-500"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              {!token && (
                <Button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 text-lg mt-4"
                >
                  {UI_CONTENT.NAVBAR.SIGN_IN}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
