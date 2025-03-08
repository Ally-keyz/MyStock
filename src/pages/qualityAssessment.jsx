import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal.jsx";
import "../components/custom-scrollbar.css";
import downloadIcon from "../assets/download.png";
import { XMarkIcon, ChartBarIcon, CalendarIcon, CubeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const QualityAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [modelOpen,setModelOpen] = useState(false);

  const triggerNotification = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleViewDetails = async (id) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await fetch(
        `https://stock-managment-2.onrender.com/quality/products/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setProductDetails(data.product);
        setModelOpen(true);
      } else {
        triggerNotification("Failed to fetch product details");
      }
    } catch (error) {
      console.log(error.message);
      triggerNotification("Error fetching product details");
    }
  };

  const fetchAssessments = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await fetch(
        `https://stock-managment-2.onrender.com/quality`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAssessments(data.data || []);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      triggerNotification("Error fetching quality assessments");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(currentPage);
  }, [currentPage]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await fetch(
        "https://stock-managment-2.onrender.com/quality/download-excel",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download quality assessment report.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quality_assessments_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      triggerNotification("Error downloading report");
      console.error("Download error:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto mt-5 max-w-screen-xl p-5">
      <div className="flex justify-end mb-4">
        <div onClick={handleDownload} className="cursor-pointer flex items-center">
          <p className="text-[12px] text-blue-500 mr-2 font-semibold">Download Report</p>
          <img src={downloadIcon} className="w-7 h-7" alt="Download Report" />
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <p className="text-[16px] text-blue-500 font-bold">Quality Assessments</p>
      </div>

      <div className="w-full h-[350px] overflow-auto scrollbar-custom border-gray-200 border shadow-md p-5 flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <Spinner />
          </div>
        ) : (
          <>
            {assessments.length === 0 ? (
              <p className="text-center text-gray-500">No quality assessments available</p>
            ) : (
              <div className="w-full overflow-auto">
                <table className="w-full text-center text-[14px] text-gray-800">
                  <thead>
                    <tr className="border-b bg-blue-400 font-extrabold text-[13px] text-white">
                      <th className="py-3 px-5">MC</th>
                      <th className="py-3 px-5">Harm</th>
                      <th className="py-3 px-5">Test Weight</th>
                      <th className="py-3 px-5">Grade</th>
                      <th className="py-3 px-5">Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment, index) => (
                      <tr
                        key={index}
                        className={`border-t border-gray-300 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="py-3 px-5">{assessment.MC}</td>
                        <td className="py-3 px-5">{assessment.harm}</td>
                        <td className="py-3 px-5">{assessment.testWeight}</td>
                        <td className="py-3 px-5">{assessment.grade}</td>
                        <td className="py-3 px-5">
                          {assessment.product ? (
                            <button
                              onClick={() => handleViewDetails(assessment.product)}
                              className="text-blue-500 hover:text-blue-700 font-medium underline"
                            >
                              View Details
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600 text-[12px] font-semibold mt-2">
          Page <span className="text-blue-700">{currentPage}</span> of{" "}
          <span className="text-black">{totalPages}</span>
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showNotification && (
        <Notification
          message={notificationMessage}
          duration={5000}
          onClose={handleNotificationClose}
        />
      )}

{productDetails && (
        <Modal
          isOpen={modelOpen}
          onClose={() => {
            setModelOpen(false);
            setProductDetails(null);
          }}
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
                <h2 className="text-[20px] font-semibold text-gray-800">
                  Product Quality Details
                </h2>
              </div>
              <button
                onClick={() => setModelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CubeIcon className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Product Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {productDetails.entry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckBadgeIcon className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quality Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      Passed
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-2">Quantity</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {productDetails.value}
                    </span>
                    <span className="text-gray-500">units</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-2">Assessment Date</p>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      {new Date(productDetails.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Moisture Content</span>
                    <span className="font-medium text-gray-700">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Impurity Level</span>
                    <span className="font-medium text-gray-700">0.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Test Weight</span>
                    <span className="font-medium text-gray-700">58 lbs/bu</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Protein Content</span>
                    <span className="font-medium text-gray-700">14.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setModelOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => window.print()}
              >
                Print Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QualityAssessment;