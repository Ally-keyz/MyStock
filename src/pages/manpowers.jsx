import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import Notification from '../components/Notification';
import { ACCESS_TOKEN } from '../constants';
import Modal from '../components/Modal.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaDownload, FaCalendarAlt, FaUsers, FaTasks } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const RequestManpower = () => {
  // Form & fetch states
  const [requests, setRequests] = useState([]);
  const [numberNeeded, setNumberNeeded] = useState('');
  const [processType, setProcessType] = useState('');
  const [processDate, setProcessDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Notification & modal states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Search & pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // Notification handlers
  const triggerNotification = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  // Fetch requests from API ensuring data is an array
  const fetchRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await fetch('https://stock-managment-2.onrender.com/manpowers', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // Ensure that requests is always an array.
      const requestsData = Array.isArray(data)
        ? data
        : data.requests || [];
      setRequests(requestsData);
    } catch (error) {
      triggerNotification('Failed to fetch recent requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle form submission to request manpower
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await fetch('https://stock-managment-2.onrender.com/manpowers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: numberNeeded, action: processType, date: processDate }),
      });
      if (response.ok) {
        triggerNotification('Manpower request submitted successfully!',"bg-green-600");
        // Clear the form
        setNumberNeeded('');
        setProcessType('');
        setProcessDate('');
        // Re-fetch requests after submission
        await fetchRequests();
      } 
    } catch (error) {
      triggerNotification('Error submitting request');
    } finally {
      setIsLoading(false);
      setShowConfirmationModal(false);
    }
  };
  

  // Filter requests based on search query
  const filteredRequests = requests.filter(req =>
    req.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Chart data for overview
  const chartData = requests.map(request => ({
    name: request.action,
    numberNeeded: request.number,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-800">Manpower Management</h1>
       <button className="bg-blue-100 text-gray-600 text-[13px] font-semibold px-6 py-2 rounded-lg hover:bg-blue-400 transition-all flex items-center">
          <FaDownload className="mr-2" />
          Download Report
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">New Manpower Request</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label flex items-center">
                <FaUsers className="mr-2" />
                Number Needed
              </label>
              <input
                type="number"
                value={numberNeeded}
                onChange={(e) => setNumberNeeded(e.target.value)}
                className="form-input border rounded p-2 w-full"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label flex items-center">
                <FaTasks className="mr-2" />
                Process Type
              </label>
              <select
                value={processType}
                onChange={(e) => setProcessType(e.target.value)}
                className="form-input border rounded p-2 w-full"
                required
              >
                <option value="">Select Process Type</option>
                <option value="Entry Stock Packing">Entry Stock Packing</option>
                <option value="Dispatching the Stock">Dispatching the Stock</option>
                <option value="Debugging">Debugging</option>
                <option value="Rotation">Rotation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label flex items-center">
                <FaCalendarAlt className="mr-2" />
                Process Date
              </label>
              <input
                type="date"
                value={processDate}
                onChange={(e) => setProcessDate(e.target.value)}
                className="form-input border rounded p-2 w-full"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 transition-all font-medium flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="small" /> : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Requests Overview Section */}
        <div className="space-y-8">
          {/* Search & Table Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Requests Overview</h2>
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number Needed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Process Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingRequests ? (
                    // Skeleton loading
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
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </td>
                        </tr>
                      ))
                  ) : currentRequests.length > 0 ? (
                    currentRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{req.number}</td>
                        <td className="px-6 py-4 text-gray-600">{req.action}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(req.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {req.approval === true ? <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                            Approved
                          </span> : <span className="px-3 py-1 rounded-full bg-red-200 text-green-800 text-sm">
                            Pending
                          </span> }

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing {filteredRequests.length === 0 ? 0 : indexOfFirstRequest + 1} to{' '}
                {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} results
              </span>
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(filteredRequests.length / requestsPerPage) }, (_, i) => (
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
          </div>
        </div>
      </div>

      {/* Notification & Confirmation Modal */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          duration={5000}
          onClose={handleNotificationClose}
        />
      )}

      {showConfirmationModal && (
        <Modal
          title="Confirm Request"
          message="Are you sure you want to submit this manpower request?"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default RequestManpower;
