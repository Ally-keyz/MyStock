import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiBox, FiActivity, FiTruck, FiPlus } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Notification from '../components/Notification';
import { useNavigate, useNavigation } from 'react-router-dom';

const Home = () => {
  const [stockPosition, setStockPosition] = useState({ totalBalance: 0, totalEntry: 0, totalDispatched: 0 });
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch stock position data
  const fetchStockPosition = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockPosition();
  }, []);

  // Fetch stock data with pagination and sorting
  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://stock-managment-2.onrender.com/stock/myStock?page=1&limits=10`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          },
        }
      );
      const data = await response.json();
      setStockData(data.stocks || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const fumigationData = [
    { name: 'Wheat', quantity: 1500, date: '2024-03-15' },
    { name: 'Corn', quantity: 800, date: '2024-03-14' },
    { name: 'Rice', quantity: 600, date: '2024-03-13' },
  ];

  const chartData = [
    { name: 'Jan', stock: 4000, fumigated: 2400 },
    { name: 'Feb', stock: 3000, fumigated: 1398 },
    { name: 'Mar', stock: 2000, fumigated: 9800 },
  ];

  // Tailwind Color Mapping
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-[18px] font-semibold text-gray-700">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  // Updated DataTable component accepts a 'dataKeys' prop
  const DataTable = ({ title, data, columns, dataKeys }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button onClick={()=> navigate("Stock")} className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
          View All <FiArrowUpRight className="ml-1" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col, index) => (
                <th key={index} className="pb-3 text-left text-sm text-gray-500 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {dataKeys.map((key, i) => (
                  <td key={i} className="py-3 text-sm text-gray-800">{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[20px] font-bold text-gray-800">Stock Overview</h1>
          <button className="bg-blue-100 text-gray-600 font-semibold text-[14px] px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors flex items-center">
            <FiPlus className="mr-2" /> Add new entry
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Stock" value={stockPosition.totalBalance} icon={FiBox} color="blue" />
          <MetricCard title="Entered Products" value={stockPosition.totalEntry} icon={FiActivity} color="gray" />
          <MetricCard title="Dispatched" value={stockPosition.totalDispatched} icon={FiTruck} color="purple" />
          <MetricCard title="Pending" value="3,750 kg" icon={FiBox} color="orange" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fumigated" fill="#3B82F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <DataTable
              title="Current Stock"
              data={stockData}
              columns={['Product', 'Quantity', 'Entry Date']}
              dataKeys={['product', 'entry', 'entryDate']}
            />
            <DataTable
              title="Recent Fumigation"
              data={fumigationData}
              columns={['Product', 'Quantity', 'Date Fumigated']}
              dataKeys={['name', 'quantity', 'date']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
