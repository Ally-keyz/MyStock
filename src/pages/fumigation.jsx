import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import Notification from '../components/Notification';
import { ACCESS_TOKEN } from '../constants';
import Modal from '../components/Modal.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaDownload, FaCalendarAlt, FaSprayCan, FaPlus } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const FumigationManagement = () => {
  // States for products and fumigants
  const [fumigatedProducts, setFumigatedProducts] = useState([]);
  const [nonFumigatedProducts, setNonFumigatedProducts] = useState([]);
  const [fumigants, setFumigants] = useState([]);
  const [activeTab, setActiveTab] = useState('nonFumigated');
  const [showFumigationModal, setShowFumigationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // States for the fumigation modal (existing)
  const [fumigantName, setFumigantName] = useState('');
  const [fumigantQuantity, setFumigantQuantity] = useState('');
  const [fumigationDate, setFumigationDate] = useState('');
  const [quantityFumigated, setQuantityFumigated] = useState("");

  // States for adding a new fumigant (new tab)
  const [newFumigantName, setNewFumigantName] = useState('');
  const [newFumigantQuantity, setNewFumigantQuantity] = useState('');
  const [newFumigantDateEntry, setNewFumigantDateEntry] = useState('');
  const [isSubmittingFumigant, setIsSubmittingFumigant] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // States for search & pagination (for products)
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [color,setColor] = useState("bg-red-500")

  // States for report download modal
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [reportMonth, setReportMonth] = useState('');
  const [reportYear, setReportYear] = useState('');
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  // Notification handling
  const triggerNotification = (msg,color) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setColor(color);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const token = localStorage.getItem("ACCESS_TOKEN");

      const response = await fetch('https://stock-managment-2.onrender.com/stock/inGoing', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data.stock)) {
        const fumigated = data.stock.filter(product => product.fumugated === true);
        const nonFumigated = data.stock.filter(product => product.fumugated === false);

        setFumigatedProducts(fumigated);
        setNonFumigatedProducts(nonFumigated);
      } else {
        console.error("Unexpected data format:", data);
        triggerNotification("Unexpected data format received");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      triggerNotification("Failed to fetch products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch fumigants available in stock
  const handleFindFumigants = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await fetch('https://stock-managment-2.onrender.com/fumigants/', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setFumigants(data.fumigants);
      } else {
        console.log("Failed to fetch the fumigants");
      }
    } catch (error) {
      console.log(`Failed to find fumigants ${error.message}`);
    }
  };

  useEffect(() => {
    handleFindFumigants();
  }, []);

  // Function to download the fumigation report using month & year from the modal
  const downloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      const url = `https://stock-managment-2.onrender.com/fumigationReports/download-fumigation-report`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download report');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `fumigation_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      triggerNotification("Report downloaded successfully!");
    } catch (error) {
      triggerNotification('Error downloading report: ' + error.message);
    } finally {
      setIsDownloadingReport(false);
      setShowDownloadModal(false);
      setReportMonth('');
      setReportYear('');
    }
  };

  // Submit handler for the report download modal
  const handleDownloadReportSubmit = async (e) => {
    e.preventDefault();
    await downloadReport();
  };

  // Handle fumigation submission (for products)
  const handleFumigationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const id = selectedProduct._id;
      console.log(fumigationDate,selectedProduct.value,fumigantName,fumigantQuantity,`id ${id}`);
      const response = await fetch(`https://stock-managment-2.onrender.com/fumigants/fumigation/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: fumigationDate,
          quantityFumugated: selectedProduct.value,
          name: fumigantName,
          quantityOfFumigants: fumigantQuantity,
        }),
      });

      if (response.ok) {
        triggerNotification('Fumigation recorded successfully!','bg-green-600');
        setShowFumigationModal(false);
        await fetchProducts();
        resetForm();
      } else {
        triggerNotification('Failed to make fumigation');
      }
    } catch (error) {
      triggerNotification('Error submitting fumigation',error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFumigantName('');
    setFumigantQuantity('');
    setFumigationDate('');
    setQuantityFumigated('');
    setSelectedProduct(null);
  };

  // Handle new fumigant creation (new tab)
  const handleNewFumigantSubmit = async (e) => {
    setIsSubmittingFumigant(true);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await fetch('https://stock-managment-2.onrender.com/fumigants/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFumigantName,
          quantity: newFumigantQuantity,
          dateEntry: newFumigantDateEntry,
        }),
      });
      if (response.ok) {
        triggerNotification('Fumigant added successfully!',"bg-green-600");
        handleFindFumigants();
        setNewFumigantName('');
        setNewFumigantQuantity('');
        setNewFumigantDateEntry('');
      } else {
        triggerNotification('Failed to add fumigant');
      }
    } catch (error) {
      triggerNotification('Error adding fumigant');
    } finally {
      setIsSubmittingFumigant(false);
    }
  };

  // Table filtering and pagination (for products)
  const filteredProducts = activeTab === 'fumigated'
    ? fumigatedProducts.filter(p => p.entry.toLowerCase().includes(searchQuery.toLowerCase()))
    : nonFumigatedProducts.filter(p => p.entry.toLowerCase().includes(searchQuery.toLowerCase()));

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-800">Fumigation Management</h1>
        <button 
          onClick={handleDownloadReportSubmit}
          className="bg-blue-100 text-gray-600 text-[13px] font-semibold px-6 py-2 rounded-lg hover:bg-blue-400 transition-all flex items-center">
          <FaDownload className="mr-2" />
          Download Report
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('nonFumigated')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'nonFumigated'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <FaSprayCan className="mr-2" />
          Pending Fumigation ({nonFumigatedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('fumigated')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'fumigated'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <FaSprayCan className="mr-2" />
          Completed Fumigation ({fumigatedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('fumigants')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'fumigants'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <FaPlus className="mr-2" />
          Fumigants ({fumigants.length})
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeTab === 'fumigants' ? (
          <div>
            {/* Form to add new fumigant */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Fumigant</h2>
              <form onSubmit={handleNewFumigantSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fumigant Name</label>
                    <input
                      type="text"
                      value={newFumigantName}
                      onChange={(e) => setNewFumigantName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={newFumigantQuantity}
                      onChange={(e) => setNewFumigantQuantity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Entry</label>
                    <input
                      type="date"
                      value={newFumigantDateEntry}
                      onChange={(e) => setNewFumigantDateEntry(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleNewFumigantSubmit}
                    className="px-6 py-2 bg-blue-500 text-white text-[14px] font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={isSubmittingFumigant}
                  >
                    {isSubmittingFumigant ? 'Submitting...' : 'Add Fumigant'}
                  </button>
                </div>
              </form>
            </div>
            {/* Table displaying all fumigants */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">Fumigants in Stock</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Entry</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fumigants.length > 0 ? (
                      fumigants.map((fumigant, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">{fumigant.name}</td>
                          <td className="px-6 py-4">{fumigant.quantity}</td>
                          <td className="px-6 py-4">{fumigant.remainingFumigants}</td>
                          <td className="px-6 py-4">{formatDate(fumigant.dateEntry)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                          No fumigants found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Existing Products Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'fumigated'
                  ? 'Fumigated Products'
                  : 'Products Requiring Fumigation'}
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry date
                    </th>
                    {activeTab === 'fumigated' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fumigant Used
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Fumigated
                        </th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {activeTab === 'nonFumigated' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingProducts ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </td>
                          {activeTab === 'fumigated' && (
                            <>
                              <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </td>
                          {activeTab === 'nonFumigated' && (
                            <td className="px-6 py-4">
                              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                            </td>
                          )}
                        </tr>
                      ))
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{product.entry}</td>
                        <td className="px-6 py-4 text-gray-600">{product.value}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(product.date)}</td>
                        {activeTab === 'fumigated' && (
                          <>
                            <div className="p-5 flex justify-center">
                              <td className="px-6 py-4 cursor-pointer hover:bg-green-100 transition-colors duration-500 rounded-full text-center bg-blue-100 text-[12px] font-semibold text-gray-600">
                                View details
                              </td>
                            </div>
                          </>
                        )}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              activeTab === 'fumigated'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {activeTab === 'fumigated' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        {activeTab === 'nonFumigated' && (
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowFumigationModal(true);
                              }}
                              className="bg-gray-400 hover:bg-blue-500 text-white text-sm font-medium py-1 px-3 rounded"
                            >
                              Add Fumigation
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'fumigated' ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing {filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1} to{' '}
                {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results
              </span>
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Fumigation Modal */}
      {showFumigationModal && (
        <Modal
          isOpen={showFumigationModal}
          onClose={() => {
            setShowFumigationModal(false);
            resetForm();
          }}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        >
          <div className="bg-white rounded-xl shadow-2xl w-[500px] relative">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Fumigation Process</h3>
              </div>
              <button
                onClick={() => {
                  setShowFumigationModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFumigationSubmit} className="px-6 py-4 space-y-6">
              {/* Fumigant Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Fumigant Details
                </label>
                <select
                  value={fumigantName}
                  onChange={(e) => setFumigantName(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select a fumigant
                  </option>
                  {(Array.isArray(fumigants) ? fumigants : []).map((fumigant) => (
                    <option value={fumigant.name} key={fumigant._id}>
                      {fumigant.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Date */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fumigant quantity (kg)</label>
                  <input
                    type="number"
                    value={fumigantQuantity}
                    onChange={(e) => setFumigantQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    step="0.5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fumigation Date</label>
                  <input
                    type="date"
                    value={fumigationDate}
                    onChange={(e) => setFumigationDate(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowFumigationModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-500 font-semibold text-[14px] hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="small" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Make Fumigation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Notification System */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          duration={5000}
          onClose={handleNotificationClose}
          color={color}
        />
      )}
    </div>
  );
};

export default FumigationManagement;
