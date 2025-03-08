import React, { useEffect, useState } from "react";
import icon1 from "../assets/edit.png";
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
  FaBalanceScale,
  FaSeedling,
  FaFlask,
  FaRuler,
  FaTimes,
  FaBars,
} from "react-icons/fa";

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
    MC: "",
    harm: "",
    testWeight: "",
    grade: "",
  });

  const [error, setError] = useState("");
  const [color, setColor] = useState("bg-red-500");
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [contract, setContract] = useState([]);



  const triggerNotification = (message, color) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setColor(color);
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

  const closeModal2 = () => {
    setModalOpen(false);
    setLoading(false); // Stop loading if modal is closed
  };


    //find the contract for entering the product
    const handleFindContract = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
          console.log("No token found");
        }
    
        const res = await fetch("https://stock-managment-2.onrender.com/contracts", {  // ✅ Add `await` 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        const data = await res.json();
    
        if (res.status === 200) {
          setContract(data.contracts);
          console.log(data.contracts);
        }
      } catch (error) {
        console.log("Fetching contracts failed:", error.message);
      }
    };
    

    useEffect(()=>{
      handleFindContract();
    },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(true); // Open the modal when loading starts

    const { entryDate, truck, wBill, originDestination, product, entry, dispatched, unitPrice, contract, MC, harm, testWeight, grade } = formData;

    // Input validation
    if (!product) {
      triggerNotification("Product required", "bg-red-500");
      setLoading(false);
      setModalOpen(false); // Close modal on error
      return;
    }

    if (!entry && !dispatched) {
      triggerNotification("Specify either entry or dispatched quantity.", "bg-red-500");
      setLoading(false);
      setModalOpen(false); // Close modal on error
      return;
    }

    if (entry && dispatched) {
      triggerNotification("Only one of entry or dispatched can be specified.", "bg-red-500");
      setLoading(false);
      setModalOpen(false); // Close modal on error
      return;
    }

    if (!unitPrice) {
      setError("Unit price is required.");
      triggerNotification("Unit price is required.", "bg-red-500");
      setLoading(false);
      setModalOpen(false); // Close modal on error
      return;
    }

    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      setLoading(false);
      setModalOpen(false); // Close modal on error
      return triggerNotification("Token has expired", "bg-red-500");
    }

    try {
      const response = await fetch("https://stock-managment-2.onrender.com/stock/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          entryDate,
          truck,
          wBill,
          originDestination,
          product:product.charAt(0).toUpperCase() + product.slice(1).toLowerCase(),
          entry: entry ? parseInt(entry, 10) : 0,
          dispatched: dispatched ? parseInt(dispatched, 10) : 0,
          unitPrice: parseFloat(unitPrice),
          contract,
          MC,
          harm,
          testWeight,
          grade,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        triggerNotification("Stock registered successfully", "bg-green-500");
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
          MC: "",
          harm: "",
          testWeight: "",
          grade: "",
        });
      } else {
        triggerNotification(data.error || "An error occurred.", "bg-red-500");
      }
    } catch (err) {
      triggerNotification("Server error. Please try again later.", "bg-red-500");
      console.log(err.message);
    } finally {
      setLoading(false);
      setModalOpen(false); // Close modal when loading is complete
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex max-w-6xl mx-auto p-5 bg-white rounded-xl shadow-2xl">
      {/* Main Form */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pr-8" : "pr-0"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div className="flex items-center">
            <img
              src={icon1}
              alt="Register Stock"
              className="w-12 h-12 mr-4 cursor-pointer transform hover:scale-110 transition-transform duration-200"
            />
            <h2 className="text-[24px] font-semibold text-blue-600">Register New Stock</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entry Date */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Entry Date <span className="text-red-500 ml-1">*</span>
              </label>
              <DatePicker
  selected={formData.entryDate || null}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
  placeholderText="Select date"
/>

            </div>

            {/* Truck */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaTruck className="mr-2 text-blue-500" />
                Truck <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="truck"
                value={formData.truck}
                onChange={handleChange}
                placeholder="Enter truck details"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Waybill */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaBarcode className="mr-2 text-blue-500" />
                Waybill <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="wBill"
                value={formData.wBill}
                onChange={handleChange}
                placeholder="Enter waybill number"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Origin/Destination */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaMapMarkedAlt className="mr-2 text-blue-500" />
                Origin/Destination <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="originDestination"
                value={formData.originDestination}
                onChange={handleChange}
                placeholder="Enter origin or destination"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Product */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaProductHunt className="mr-2 text-blue-500" />
                Product <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Entry Quantity */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaPlusCircle className="mr-2 text-blue-500" />
                Entry Quantity <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="entry"
                value={formData.entry}
                onChange={handleChange}
                placeholder="Enter entry quantity"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Unit Price */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaSignOutAlt className="mr-2 text-blue-500" />
                Unit Price <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="Enter unit price"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-[400px] py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Register Stock
            </button>
          </div>
        </form>

        {/* Notification */}
        {showNotification && (
          <Notification
            message={notificationMessage}
            color={color}
            duration={5000}
            onClose={handleNotificationClose}
          />
        )}
      </div>

      {/* Quality Assessment Sidebar */}
      <div
        className={`w-1/3 pl-8 border-l border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        }`}
      >
        <h2 className="text-[24px] font-semibold text-blue-600 mb-8">Quality Assessment</h2>
        <div className="space-y-6">
{/* Contract */}
{/* Contract */}
<div className="flex flex-col">
  <label
    htmlFor="contract"
    className="mb-2 text-sm font-medium text-gray-700 flex items-center"
  >
    <FaFileContract className="mr-2 text-blue-500" />
    Contract
  </label>

  <select
    id="contract"
    name="contract"
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
    value={formData.contract}
    onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
  >
    <option value="" disabled>
      Select a contract
    </option>
    {(Array.isArray(contract) ? contract : []).map((contra) => (
      <option value={contra.operatorName} key={contra._id}>
        {contra.operatorName}
      </option>
    ))}
  </select>
</div>



          {/* MC */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaBalanceScale className="mr-2 text-blue-500" />
              MC
            </label>
            <input
              type="number"
              name="MC"
              value={formData.MC}
              onChange={handleChange}
              placeholder="Enter MC"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Harm */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaSeedling className="mr-2 text-blue-500" />
              Harm
            </label>
            <input
              type="text"
              name="harm"
              value={formData.harm}
              onChange={handleChange}
              placeholder="Enter harm details"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Test Weight */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaFlask className="mr-2 text-blue-500" />
              Test Weight
            </label>
            <input
              type="number"
              name="testWeight"
              value={formData.testWeight}
              onChange={handleChange}
              placeholder="Enter test weight"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Grade */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaRuler className="mr-2 text-blue-500" />
              Grade
            </label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="Enter grade"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

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
                    Registering Stock
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
                  onClick={closeModal2}
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
    </div>
  );
};

export default RegisterStockForm;