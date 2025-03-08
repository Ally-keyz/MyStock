import React, { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import "../components/custom-scrollbar.css"
import img2 from "../assets/download.png";
import download from "../assets/d1.png"


const VirtualizedTab = ({ items, onDownload }) => (
    <div className="mt-2 overflow-auto scrollbar-custom flex rounded-md shadow-xl justify-center w-full">
      <table className="w-full text-center text-[14px] text-gray-800 border-collapse">
        {/* Table Header - Render only once */}
        <thead>
          <tr className="border-b bg-blue-400 font-bold text-[13px] text-white">
            <th className="py-3 px-5">Products</th>
            <th className="py-3 px-5">Entry Date</th>
            <th className="py-3 px-5">Truck</th>
            <th className="py-3 px-5">Origin/Destination</th>
            <th className="py-3 px-5">Entry</th>
            <th className="py-3 px-5">Dispatched</th>
            <th className="py-3 px-5">Balance</th>
            <th className="py-3 px-5">Download</th> {/* Add a header for download */}
          </tr>
        </thead>
  
        {/* Table Body - Render all rows directly */}
        <tbody>
          {items?.map((item, index) => (
            <tr
              key={index}
              className={`border-t border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
            >
              <td className="py-3 text-[12px] font-semibold text-green-600 px-5">
                {item?.product === "Unknown" ? "Beans" : item?.product}
              </td>
              <td className="py-3 text-[12px] font-semibold text-blue-800 px-5">
                {item?.entryDate}
              </td>
              <td className="py-3 text-[12px] font-semibold text-green-600 px-5">
                {item?.truck}
              </td>
              <td className="py-3 text-[12px] font-semibold text-blue-800 px-5">
                {item?.originDestination}
              </td>
              <td className="py-3 text-[12px] font-semibold text-green-600 px-5">
                {item?.entry !== undefined ? parseFloat(item?.entry).toFixed(2) : 'N/A'}
              </td>
              <td className="py-3 text-[12px] font-semibold text-orange-700 px-5">
                {item?.dispatched !== undefined ? parseFloat(item?.dispatched).toFixed(2) : 'N/A'}
              </td>
              <td className="py-3 text-[12px] font-semibold text-red-600 px-5">
                {item?.balance !== undefined ? parseFloat(item?.balance).toFixed(2) : 'N/A'}
              </td>
              <td className="py-3 text-[12px] font-semibold text-gray-800 px-5">
                {/* Download Button with Icon */}
                <button onClick={() => onDownload(item)} className="p-2">
                  <img src={download} alt="Download" className="w-6 h-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
const TabsWithVirtualizedData = () => {
  const [activeTab, setActiveTab] = useState('Monthly Reports');
  const [data, setData] = useState({
    'Monthly Reports': [],
    'Anual Reports': [],
    'Fumugation Reports': [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const fetchTabData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
        const endpointMap = {
            'Monthly Reports': '/reports/monthly',
            'Anual Reports': '/reports/annual',
            'Fumugation Reports': '/reports/fumigation',
        };

        const token = localStorage.getItem("ACCESS_TOKEN"); // Retrieve token from localStorage
        if (!token) {
            setLoading(false);
            return triggerNotification("Token has expired", "bg-red-500");
        }

        // Set default values for month and year if they are not provided
        const currentDate = new Date();
        const defaultMonth = "2"; // getMonth() returns 0-11, so add 1 to get 1-12
        const defaultYear = "2012";

        const finalMonth = month || defaultMonth; // Use user input or default month
        const finalYear = year || defaultYear;   // Use user input or default year

        // Include month and year in the query if they are provided
        const queryParams = new URLSearchParams();
        queryParams.append('month', finalMonth);
        queryParams.append('year', finalYear);

        const response = await fetch(
            `https://stock-managment-2.onrender.com/myStock${endpointMap[tab]}?${queryParams.toString()}`, // Append query parameters
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Log the response status and text to debug
        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Response text:", responseText);

        // Try to parse the response only if it's valid JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Response is not in JSON format.');
        }

        if (response.ok) {
            setData((prevData) => ({ ...prevData, [tab]: result.data || [] }));
        } else {
            throw new Error(result.message || 'Failed to fetch data.');
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


  const handleDownload = async (item) => {

    const defaultMonth = "2"; // getMonth() returns 0-11, so add 1 to get 1-12
    const defaultYear = "2012";

    const finalMonth = month || defaultMonth; // Use user input or default month
    const finalYear = year || defaultYear;

    const queryParams = new URLSearchParams();
    queryParams.append('month', finalMonth);
    queryParams.append('year', finalYear);

    
    const token = localStorage.getItem("ACCESS_TOKEN"); // Retrieve token from localStorage
    if (!token) {
        setLoading(false);
        return triggerNotification("Token has expired", "bg-red-500");
    }

    try {
      const response = await fetch(
        `https://stock-managment-2.onrender.com/myStock/reports/monthly/word?${queryParams.toString()}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        }
      );
      if (!response.ok) throw new Error('Failed to download the report.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error: ' + err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    if (data[activeTab].length === 0) {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch data again when month or year changes
    if (month && year) {
      fetchTabData(activeTab);
    }
  }, [month, year]);

  return (
    <div className="w-full mx-auto p-2">
      <div className="flex border-b bg-gray-50 rounded-md border-gray-400">
        {['Monthly Reports', 'Anual Reports', 'Fumugation Reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center border-b-2 ${
              activeTab === tab
                ? 'border-blue-400 text-[14px] text-blue-500 font-bold'
                : 'border-transparent text-[13px] font-semibold text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Month and Year Selection */}
      {activeTab === 'Monthly Reports' && (
        <div className="mt-4 flex gap-4">
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Month (1-12)"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-2 border border-gray-300  rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

{activeTab === 'Anual Reports' && (
        <div className="mt-4 flex gap-4">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-2 border border-gray-300  rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      <div className="p-4 h-[400px] overflow-auto scrollbar-custom  bg-white shadow-md rounded-b-lg">
        {loading ? (
          <div className="text-gray-500 p-5 flex justify-center items-center">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 p-5 flex justify-center items-center">
            {error}
          </div>
        ) : data[activeTab]?.length > 0 ? (
          <VirtualizedTab
            items={data[activeTab]}
            onDownload={handleDownload}
          >

          </VirtualizedTab>
        ) : (
          <div className="text-gray-500">No data available.</div>
        )}
      </div>
    </div>
  );
};

export default TabsWithVirtualizedData;

