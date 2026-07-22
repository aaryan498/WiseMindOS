import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import logo from "../assets/logo.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="WiseMindOS"
            className="w-10 h-10 rounded-full"
          />

          <span className="text-2xl font-bold text-white">
            Wise
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Mind
            </span>
            OS
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`transition ${
                location.pathname === item.href
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-indigo-500 text-white hover:bg-indigo-500 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>

        <button
          className="md:hidden text-gray-300 hover:text-indigo-400 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence> {/* Wrap the conditional rendering with AnimatePresence */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-transparent backdrop-blur-md transition duration-100 border-t border-white/10 px-6 py-4 space-y-4"
          >

          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/login"
            className="block text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="block text-indigo-400"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}