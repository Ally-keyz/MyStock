import React, { useState, useEffect, useMemo } from "react";
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import img1 from "../assets/i3.png";
import img2 from "../assets/download.png";
import Modal from "../components/Modal";
import FileUploadForm from "../components/FileUpload";
import "../components/custom-scrollbar.css";

function Stock() {
    const [modelOpen, setModelOpen] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stockPosition, setStockPosition] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [error, setError] = useState(null);

    const headers = [
        "product",
        "entryDate",
        "truck",
        "originDestination",
        "contract",
        "entry",
        "dispatched",
        "openingBalance",
        "balance"
      ];

    // Fetch stock position data
    const fetchStockPosition = async () => {
        try {
            const response = await fetch("https://stock-managment-2.onrender.com/stock/position", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch stock position');
            const data = await response.json();
            setStockPosition(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching stock position:', error);
            setError(error.message);
        }
    };

    // Fetch stock data with pagination and sorting
    const fetchStocks = async (page) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://stock-managment-2.onrender.com/stock/myStock?page=${page}&limits=10&sort=${sortConfig.key}&order=${sortConfig.direction}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
                    },
                }
            );
            const data = await response.json();
            setStockData(data.stocks || []);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            setError('Failed to load stock data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks(currentPage);
    }, [currentPage, sortConfig]);

    useEffect(() => {
        fetchStockPosition();
        const interval = setInterval(fetchStockPosition, 30000);
        return () => clearInterval(interval);
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
      

    // Sorting handler
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sorted stock data
    const sortedStockData = useMemo(() => {
        return [...stockData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [stockData, sortConfig]);

    // Download handlers
    const handleDownload = async (type = 'report') => {
        const endpoints = {
            report: 'stock/download',
            position: 'stock/position/download'
        };
        
        try {
            const response = await fetch(`https://stock-managment-2.onrender.com/${endpoints[type]}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
                },
            });

            if (!response.ok) throw new Error(`Failed to download ${type}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${type}_report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error downloading ${type}:`, error);
            alert(`There was an error downloading the ${type} report. Please try again.`);
        }
    };

    return (
        <>
            <div className="flex justify-end sm:w-[970px] p-5 w-full">
                <div className="flex justify-evenly">
                    <div onClick={() => setModelOpen(true)} className="cursor-pointer flex mr-5">
                        <p className='text-[12px] text-gray-600 mr-2 mt-1 font-semibold'>Register new stock</p>
                        <img src={img1} className='w-7 h-7' alt="Register" />
                    </div>
                    <div onClick={() => handleDownload('report')} className="cursor-pointer flex">
                        <p className='text-[12px] text-blue-500 mr-2 mt-1 font-semibold'>Download report</p>
                        <img src={img2} className='w-7 h-7' alt="Download" />
                    </div>
                </div>
            </div>

            <div className="p-1">
                <div className="flex justify-center p-3">
                    <p className='text-[20px] text-blue-500 font-semibold'>
                        Current stock 
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                    </div>
                )}

                {/* Stock Position Summary */}
                <div className="w-full p-5 rounded-md border border-gray-200 shadow-md mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-blue-500 text-[20px] font-semibold">Stock Position Summary</div>
                        <button 
                            onClick={fetchStockPosition}
                            className="px-3 py-1 bg-gray-200 text-white rounded hover:bg-gray-500 text-sm"
                        >
                            Refresh
                        </button>
                    </div>
                    {stockPosition ? (
                        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {/* Summary Cards */}
                            {[
                                { title: 'Total Balance', value: stockPosition.totalBalance, color: 'blue' },
                                { title: 'Total Entry', value: stockPosition.totalEntry, color: 'blue' },
                                { title: 'Total Dispatched', value: stockPosition.totalDispatched, color: 'blue' },
                                
                            ].map((metric, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className={`text-${metric.color}-500 text-sm font-semibold mb-2`}>
                                        {metric.title}
                                    </div>
                                    <div className={`text-2xl font-bold text-${metric.color}-600`}>
                                        {metric.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">Loading stock position...</div>
                    )}
                </div>

                {/* Visualization Section */}


                <div className="w-full scrollbar-custom mt-20 shadow-md overflow-auto rounded-t-md">
    <table className="w-full text-center text-[14px] text-gray-800">
      <thead>
        <tr className="bg-gradient-to-r from-blue-400 to-blue-400 font-extrabold text-[13px] text-white">
          {headers.map((header) => (
            <th 
              key={header}
              className="py-3 px-5 cursor-pointer hover:bg-blue-700 transition-colors"
              onClick={() => handleSort(header)}
            >
              {header.charAt(0).toUpperCase() + header.slice(1)}
              {sortConfig.key === header && (
                sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedStockData.map((item, index) => (
          <tr
            key={index}
            className={`border-t border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
          >
            {headers.map((header) => (
              <td 
                key={header}
                className={`py-3 text-[13px] font-semibold px-5 ${
                  header === 'entry' ? 'text-green-600' :
                  header === 'dispatched' ? 'text-red-600' :
                  header === 'balance' ? 'text-blue-600' : 'text-gray-700'
                  
                }`}
              >
                {item[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-gray-600 text-[12px] font-semibold mt-2">
                        Page <span className="text-blue-700">{currentPage}</span> of <span className="text-black">{totalPages}</span>
                    </span>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={modelOpen} onClose={() => setModelOpen(false)}>
                <div className="p-5 sm:p-0 w-full sm:w-[600px] h-[400px] bg-white rounded-md">
                    <FileUploadForm />
                </div>
            </Modal>
        </>
    );
}

export default Stock;