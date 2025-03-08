import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaTruck,
  FaBarcode,
  FaMapMarkedAlt,
  FaProductHunt,
  FaPlusCircle,
  FaSignOutAlt,
  FaFileContract,
  FaTimes,
  FaBars,
  FaCheckCircle,
  FaCloudUploadAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const RegisterStockForm = () => {
  const [formData, setFormData] = useState({
    entryDate: "",
    truck: "",
    wBill: "",
    originDestination: "",
    product: "",
    entry: "",
    unitPrice: "",
    dispatched: "",
    contract: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [contracts, setContracts] = useState([]);

  const triggerNotification = (message, type = "error") => {
    setNotificationMessage({ message, type });
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, entryDate: date });
  };

  const handleFindContracts = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await fetch("https://stock-managment-2.onrender.com/contracts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) setContracts(data.contracts);
    } catch (error) {
      console.log("Fetching contracts failed:", error.message);
    }
  };

  useEffect(() => {
    handleFindContracts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(true);

    const { product, entry, dispatched, unitPrice } = formData;

    if (!product) {
      triggerNotification("Product name is required");
      return;
    }

    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await fetch("https://stock-managment-2.onrender.com/stock/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          product: product.charAt(0).toUpperCase() + product.slice(1).toLowerCase(),
          entry: entry ? parseInt(entry, 10) : 0,
          dispatched: dispatched ? parseInt(dispatched, 10) : 0,
          unitPrice: parseFloat(unitPrice),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        triggerNotification("Stock dispatched successfully!", "success");
        setFormData({
          entryDate: "",
          truck: "",
          wBill: "",
          originDestination: "",
          product: "",
          entry: "",
          dispatched: "",
          unitPrice: "",
          contract: "",
        });
      } else {
        triggerNotification(data.error || "Dispatch failed");
      }
    } catch (err) {
      triggerNotification("Network error. Please try again.");
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pr-8" : "pr-0"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FaCloudUploadAlt className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Stock Dispatch Portal</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Dispatch Date
              </label>
              <DatePicker
  selected={formData.entryDate || null}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
  placeholderText="Select date"
/>

            </div>

            {/* Truck Details */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaTruck className="mr-2 text-blue-500" />
                Truck Details
              </label>
              <input
                type="text"
                name="truck"
                value={formData.truck}
                onChange={handleChange}
                placeholder="Enter truck number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Waybill Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaBarcode className="mr-2 text-blue-500" />
                Waybill Number
              </label>
              <input
                type="text"
                name="wBill"
                value={formData.wBill}
                onChange={handleChange}
                placeholder="Enter waybill number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Contract Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaFileContract className="mr-2 text-blue-500" />
                Contract
              </label>
              <select
                name="contract"
                value={formData.contract}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select contract</option>
                {contracts.map(contract => (
                  <option key={contract._id} value={contract.operatorName}>
                    {contract.operatorName}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaProductHunt className="mr-2 text-blue-500" />
                Product Name
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaPlusCircle className="mr-2 text-blue-500" />
                Dispatch Quantity
              </label>
              <input
                type="number"
                name="dispatched"
                value={formData.dispatched}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaSignOutAlt className="mr-2 text-blue-500" />
                Unit Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-600">
                <FaMapMarkedAlt className="mr-2 text-blue-500" />
                Destination
              </label>
              <input
                type="text"
                name="originDestination"
                value={formData.originDestination}
                onChange={handleChange}
                placeholder="Enter destination"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl"
          >
            {loading ? "Processing..." : "Dispatch Stock"}
          </motion.button>
        </form>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6"
            >
              <Notification
                message={notificationMessage.message}
                type={notificationMessage.type}
                onClose={handleNotificationClose}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Modal */}
        <AnimatePresence>
      {/* Loading Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-8 w-[500px] max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full animate-pulse delay-100"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-100 rounded-full animate-pulse delay-300"></div>

              {/* Main content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Animated progress circle */}
                <div className="relative w-24 h-24 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="stroke-gray-200"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="stroke-blue-500 animate-progress"
                      style={{
                        strokeDasharray: 251,
                        strokeDashoffset: 251,
                        animation: 'progress 2s ease-out forwards'
                      }}
                    />
                  </svg>

                  {/* Spinner icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
                      <path
                        className="fill-blue-500"
                        d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Animated text */}
                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 animate-pulse">
                    Dispatching  Stock
                    <span className="inline-block ml-1 space-x-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span 
                          key={i}
                          className="inline-block animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >.</span>
                      ))}
                    </span>
                  </h3>
                  <p className="text-gray-600 animate-pulse delay-500">
                    Securing your connection...
                  </p>
                </div>

                {/* Cancel button */}
                <button
                  onClick={()=>setModalOpen(false)}
                  className="mt-6 px-6 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes progress {
              to { stroke-dashoffset: 50; }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .animate-progress {
              animation: progress 2s ease-out forwards;
            }
            .animate-spin {
              animation: spin 1.5s linear infinite;
            }
          `}</style>
        </div>
      )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterStockForm;