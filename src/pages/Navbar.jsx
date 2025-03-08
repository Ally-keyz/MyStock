import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/log2.png";
import Notification from "../components/Notification.jsx";


const Navbar = ({ bg }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);






  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  // Notification handler
  const triggerNotification = (message, color) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setColor(color);
    setTimeout(() => setShowNotification(false), 5000); // Auto-close after 5 seconds
  };


  return (
    <nav
      className={`w-full fixed top-0  left-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#035B94] shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-2 h-[100px]">
        <div className="flex">
        {/* Logo */}
        <div>
          <img src={logo} width={180} alt="" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex ml-20 items-center space-x-6">
          {["Home",  "About", "contact"].map((item, index) => (
            <NavLink
              key={index}
              to={`/${item === "Home" ? "" : item}`}
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-medium text-[14px] border-b-2 border-blue-400 underline-offset-4"
                  : "text-gray-600 font-medium text-[14px] hover:text-black transition-all duration-300"
              }
            >
             {item}
            </NavLink>
          ))}
          {/* Interactive Login Button */}
          <button
            onClick={() => setModelOpen4(true)}
            className="relative px-10 py-2 text-gray-600 font-semibold text-[14px] rounded-full border border-gray-400 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Login
            <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 hover:opacity-10"></span>
          </button>
        </div>

        


        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {!isOpen ? (
            <svg
              className="h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-white font-semibold text-[22px] sm:mr-10">Welcome to Ihunikiro system !</div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#035B94] p-4 space-y-4">
          {["Home", "Guide", "About", "contact"].map((item, index) => (
            <NavLink
              key={index}
              to={`/${item === "Home" ? "" : item}`}
              className="block text-white font-semibold text-[15px] hover:text-[#FFD700] transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </NavLink>
          ))}
          {/* Interactive Login Button for Mobile */}
          <button
            onClick={() => {
              setModelOpen4(true);
              setIsOpen(false);
            }}
            className="block px-6 py-2 text-white font-semibold text-[15px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
          >
            {t("nav.login")}
          </button>

        </div>
      )}


    </nav>
  );
};

export default Navbar;
