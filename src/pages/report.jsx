import React, { useState } from "react";
import TabsWithVirtualizedData from "../components/reportTabs";
import { FiDownloadCloud, FiFileText, FiFile, FiCalendar, FiX } from "react-icons/fi";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

function Report() {
  const [modelOpen, setModelOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState("");
  const [reportType, setReportType] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => setModelOpen(false);

  const handleReportGeneration = async () => {
    setLoading(true);
    try {
      // ... existing generation logic ...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Reports</h1>
            <nav className="flex space-x-2 mt-2">
              <span className="text-gray-500">Stock Management</span>
              <span className="text-gray-300">/</span>
              <span className="text-blue-600 font-medium">Reports</span>
            </nav>
          </div>
          
          <button 
            onClick={() => setModelOpen(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center"
          >
            <FiDownloadCloud className="mr-2" />
            Generate Report
          </button>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <TabsWithVirtualizedData />
        </div>

        {/* Generation Modal */}
        <Modal isOpen={modelOpen} onClose={closeModal}>
          <div className="bg-white rounded-xl p-8 w-full max-w-xl relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate Custom Report</h2>

            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Format</label>
                <div className="grid grid-cols-2 gap-4">
                  {["word", "excel"].map((format) => (
                    <button
                      key={format}
                      onClick={() => setReportFormat(format)}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center
                        ${reportFormat === format 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'}`}
                    >
                      <FiFileText className={`w-6 h-6 mr-2 ${reportFormat === format ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={reportFormat === format ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                        {format.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Report Period</label>
                <div className="grid grid-cols-2 gap-4">
                  {["monthly", "annual"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`p-4 rounded-lg border-2 transition-all
                        ${reportType === type 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'}`}
                    >
                      <div className="flex items-center justify-center">
                        <FiCalendar className={`w-6 h-6 mr-2 ${reportType === type ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={reportType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                {reportType === "monthly" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={year}
                    min="2000"
                    max={new Date().getFullYear()}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleReportGeneration}
                disabled={loading || !reportFormat || !reportType || !year}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 text-white" />
                ) : (
                  <>
                    <FiDownloadCloud className="mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Report;