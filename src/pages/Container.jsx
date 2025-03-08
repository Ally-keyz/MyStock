import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaChevronDown,  FaFile, FaPeopleCarry, FaUserCircle  } from 'react-icons/fa';
import { FaBell,  FaMouse,  FaUser } from 'react-icons/fa';
import { FiAlertCircle, FiBell, FiInfo, FiFilter } from 'react-icons/fi';
import "../components/custom-scrollbar.css";
import Modal from '../components/Modal';
import log from "../assets/logo.png";
import icon1 from "../assets/i1.png";
import icon2 from "../assets/i2.png";
import icon3 from "../assets/i3.png";
import icon4 from "../assets/i4.png";
import icon5 from "../assets/i5.png";
import icon6 from "../assets/i6.png";
import user from "../assets/person.png";
import Notification from '../components/Notification';

const Layout = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [color, setColor] = useState("bg-red-500");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const toggleDropdown = (menu) => setDropdownOpen(dropdownOpen === menu ? null : menu);
  const closeModal2 = () => setModelOpen(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
const [darkMode, setDarkMode] = useState(false);
const [activeNotifTab, setActiveNotifTab] = useState('all');
const [showFilters, setShowFilters] = useState(false);
const [showSystem, setShowSystem] = useState(true);
const [showUpdates, setShowUpdates] = useState(true);
const [notifications, setNotifications] = useState([
  // Sample notifications
  {
    id: 1,
    title: 'New System Update',
    message: 'Version 2.3.1 is now available',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    type: 'system'
  },
  {
    id: 2,
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
    type: 'update'
  }
]);
      

      const triggerNotification = (message, color) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setColor(color);
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
    };
// Format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
};

// Filter notifications
const filteredNotifications = notifications.filter(notification => {
  let matches = true;
  if (activeNotifTab === 'unread') matches = !notification.read;
  if (activeNotifTab === 'system') matches = notification.type === 'system';
  if (!showSystem && notification.type === 'system') matches = false;
  if (!showUpdates && notification.type === 'update') matches = false;
  return matches;
});

const unreadCount = notifications.filter(n => !n.read).length;
const systemCount = notifications.filter(n => n.type === 'system').length;



  // Update time based on device clock and set greeting accordingly
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(formattedTime);

      const hour = now.getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Check for token and user data in localStorage
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const userData = localStorage.getItem("USER");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUsers(parsedUser);
      
      } catch (e) {
        console.error("Error parsing user data:", e);
        setUsers(null);
      }
    }
    if (!token || !userData) {
      navigate('/');
    }else{
      triggerNotification("Logged in successfully","bg-green-600");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleMarkAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  

  const handleMarkRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <>                                         {/* Notification */}

    <div className="flex h-screen">
      {/* Left Sidebar */}

      <div className="p-3">
        <div className={`fixed z-20 h-full overflow-auto scrollbar-custom rounded-md bg-gray-500  shadow-sm text-white flex flex-col pt-10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-[200px]'} md:relative md:translate-x-0 w-[205px]`}>
          <div className="flex justify-center font-bold text-[18px]">
            <div className="w-[10000px]  flex justify-center items-center text-black text-[13px] h-[80px] p-5 rounded-t-md bg-gray-500   relative top-[-40px]">
              <img src={log} className='w-11 h-12 mr-2' alt="" />
              <p className='text-white font-bold text-[20px] '>Ihunikiro </p>
            </div>
          </div>
          <nav className="flex-1 px-2 py-1 space-y-1">
            <NavLink
              to=""
              className={({ isActive }) =>
                `flex button text-[9px] items-center px-2 py-2 text-sm font-semibold rounded transition-colors duration-700 ${
                  isActive ? 'text-white bg-blue-200' : 'text-white font-bold hover:bg-gray-700'
                }`
              }
            >
              <img src={icon2} className="w-5 h-5 mr-2" alt="" />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              to="Contracts"
              className={({ isActive }) =>
                `flex button text-[9px] items-center px-2 py-2 text-sm font-semibold rounded transition-colors duration-700 ${
                  isActive ? 'text-white bg-blue-400' : 'text-white font-bold hover:bg-gray-700'
                }`
              }
            >
              <FaFile className="w-5 h-5 mr-2 text-black"  />
              <p>Contracts</p>
            </NavLink>
            <NavLink
              to="Manpowers"
              className={({ isActive }) =>
                `flex button text-[9px] items-center px-2 py-2 text-sm font-semibold rounded transition-colors duration-700 ${
                  isActive ? 'text-white bg-blue-400' : 'text-white font-bold hover:bg-gray-700'
                }`
              }
            >
              <FaPeopleCarry className="w-5 h-5 mr-2 text-black"  />
              <p>Man powers </p>
            </NavLink>
            <div className="text-center text-[15px] p-3 font-semibold text-gray-700"> Current stock details</div>
            <div className="relative">
              <button onClick={() => toggleDropdown('currentStock')} className="flex items-center w-full px-2 py-2 text-[15px] font-semibold rounded hover:bg-gray-700">
                <img src={icon4} className="w-5 h-5 mr-2" alt="" /> Stock <FaChevronDown className="ml-auto" />
              </button>
              {dropdownOpen === 'currentStock' && (
  <div className="ml-5 mt-1 space-y-1">
    <NavLink 
      to="Stock" 
      className={({ isActive }) => 
        `block px-2 py-1 text-[14px] font-semibold rounded 
        ${isActive ? 'bg-blue-400 text-black' : 'text-white'} hover:bg-gray-700`
      }
    >
      Current stock
    </NavLink>
    <NavLink 
      to="Report" 
      className={({ isActive }) => 
        `block px-2 py-1 text-[14px] font-semibold rounded 
        ${isActive ? 'bg-blue-400 text-black' : 'text-white'} hover:bg-gray-700`
      }
    >
      Stock reports
    </NavLink>
  </div>
)}

            </div>
            <div className="text-center text-[15px] p-3 font-semibold text-gray-700">Stock activities</div>
            <div className="relative">
              <button onClick={() => toggleDropdown('entryProcess')} className="flex items-center w-full px-2 py-2 text-[15px] font-semibold rounded hover:bg-gray-700">
                <img src={icon4} className="w-5 h-5 mr-2" alt="" /> Entry process <FaChevronDown className="ml-auto" />
              </button>
              {dropdownOpen === 'entryProcess' && (
  <div className="ml-5 mt-1 space-y-1">
    <NavLink 
      to="Entry" 
      className={({ isActive }) => 
        `block px-2 py-1 text-[14px] font-semibold rounded 
        ${isActive ? 'bg-blue-400 text-black' : 'text-white'} hover:bg-gray-700`
      }
    >
      Register entry
    </NavLink>
    <NavLink 
      to="Quality" 
      className={({ isActive }) => 
        `block px-2 py-1 text-[14px] font-semibold rounded 
        ${isActive ? 'bg-blue-400 text-black' : 'text-white'} hover:bg-gray-700`
      }
    >
      Quality Assessment
    </NavLink>
    <NavLink 
      to="Fumigation" 
      className={({ isActive }) => 
        `block px-2 py-1 text-[14px] font-semibold rounded 
        ${isActive ? 'bg-blue-400 text-black' : 'text-white'} hover:bg-gray-700`
      }
    >
      Fumigation
    </NavLink>
  </div>
)}

            </div>
            <NavLink
              to="Dispatched"
              className={({ isActive }) =>
                `flex button text-[9px] items-center px-2 py-2 text-sm font-semibold rounded transition-colors duration-700 ${
                  isActive ? 'text-white bg-blue-400' : 'text-white font-bold hover:bg-gray-700'
                }`
              }
            >
              <img src={icon5} className="w-5 h-5 mr-2" alt="" />
              <p>Dispatch</p>
            </NavLink>
            <NavLink
              to="Report"
              className={({ isActive }) =>
                `flex button text-[9px] items-center px-2 py-2 text-sm font-semibold rounded transition-colors duration-700 ${
                  isActive ? 'text-white bg-blue-400' : 'text-white font-bold hover:bg-gray-700'
                }`
              }
            >
              <img src={icon6} className="w-5 h-5 mr-2" alt="" />
              <p>Report</p>
            </NavLink>
          </nav>
          <div className="flex pl-5 mb-10 cursor-pointer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-2 bg-white fixed w-full sm:w-[1000px] z-50 flex sm:justify-between justify-around">
          <div>
            <div className="">
              <h2 className="hidden sm:block text-[16px] text-gray-600 font-bold">
                Welcome <span className="text-blue-500">{users.name}</span>
              </h2>
              <h1 className="text-[12px] hidden sm:block text-gray-300 font-semibold">
                {greeting}! {time}
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            {/* Notification Icon */}
            <button onClick={() => setNotifModalOpen(true)} className="relative p-2 bg-gray-200 hover:bg-blue-300 rounded-full w-[125px] h-10  transition-colors duration-500 flex mr-14 focus:outline-none">
              <FaBell size={24} className="text-white hover:text-blue-600 transition-colors" />
              {/* Optional badge can be added here */}
              <p className='text-gray-600 font-semibold text-[13px] mt-[2px] ml-1'>Notifications</p>
            </button>
            <button onClick={() => navigate("Messages")} className="relative bg-gray-200 rounded-full w-[120px] hover:bg-blue-300 transition-colors duration-500 p-2 h-10 flex mr-14 focus:outline-none">
              <FaMouse size={24} className="text-white hover:text-blue-600 transition-colors" />
              {/* Optional badge can be added here */}
              <p className='text-gray-600 font-semibold text-[13px] mt-[2px] ml-1'>Massenger</p>
            </button>
            {/* Profile Section */}
            <div onClick={() => setModelOpen(true)} className="cursor-pointer h-10 w-[200px] flex rounded-full  bg-blue-200 hover:bg-gray-300 transition-colors duration-500">
              <FaUserCircle className="w-10 h-9 text-white mt-[2px]" />
              <p className="text-[13px] font-semibold text-gray-600 mt-[9px] ml-10">
                Store manager
              </p>
            </div>
          </div>
          <button className="md:hidden text-blue-400" onClick={toggleSidebar}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>
        <div className="p-4">
          <main className="flex-1 h-full p-6 border border-zinc-300 rounded-md shadow-md overflow-auto mt-[100px] max-w-[1000px] scrollbar-custom">
            {children}
          </main>
        </div>
      </div>

      {/* Profile Modal */}
<Modal isOpen={modelOpen} onClose={closeModal2}>
  <div className="flex p-5 sm:p-0 w-full sm:w-[700px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">
    {/* Left Side Navigation */}
    <div className="w-1/3 bg-gradient-to-b from-blue-50 to-indigo-50 p-6 flex flex-col justify-between border-r border-gray-200">
      <div>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaUser className="w-16 h-14 text-gray-600" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            <svg className={`w-5 h-5 mr-3 ${activeTab === 'profile' ? 'text-white' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            <svg className={`w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-white' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center bg-gray-300 p-3 text-sm font-medium text-black hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log Out
      </button>
    </div>

    {/* Right Side Content */}
    <div className="w-2/3 p-8 overflow-y-auto">
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{users.name}</h2>
            <p className="text-gray-500 font-medium">{users.position}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Personal Information</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-gray-400">Email</dt>
                  <dd className="text-gray-600">{users.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Contact</dt>
                  <dd className="text-gray-600">{users.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Branch</dt>
                  <dd className="text-gray-600">{users.wareHouse}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">Location</dt>
                  <dd className="text-gray-600">{users.location}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-700">Dark Mode</h3>
                <p className="text-sm text-gray-500">Enable dark theme</p>
              </div>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${
                  darkMode ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language Preference</label>
              <select className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Push Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</Modal>
{/* Notifications Modal */}
<Modal isOpen={notifModalOpen} onClose={() => setNotifModalOpen(false)}>
  <div className="w-full sm:w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden">
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg"
            >
              Mark all as read
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
              >
                <FiFilter className="w-5 h-5" />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-2">
                    <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input 
                        type="checkbox" 
                        checked={showSystem}
                        onChange={() => setShowSystem(!showSystem)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">System Notifications</span>
                    </label>
                    <label className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input 
                        type="checkbox" 
                        checked={showUpdates}
                        onChange={() => setShowUpdates(!showUpdates)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Product Updates</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {['All', 'Unread', 'System'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveNotifTab(tab.toLowerCase())}
              className={`pb-2 px-1 text-sm font-medium ${
                activeNotifTab === tab.toLowerCase()
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} {tab === 'Unread' && unreadCount > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FiBell className="w-12 h-12 mb-4" />
            <p className="text-lg">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`group flex items-start p-4 rounded-lg transition-all ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'system' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {notification.type === 'system' ? (
                    <FiAlertCircle className="w-5 h-5 text-purple-600" />
                  ) : (
                    <FiInfo className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{notifications.length} total notifications</span>
          <div className="flex space-x-3">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
              {unreadCount} unread
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>
              {systemCount} system
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</Modal>
    </div>
    {showNotification && (
<Notification
message={notificationMessage}
color={color}
duration={1000}
onClose={handleNotificationClose}
/>
)}
    </>
  );
};

export default Layout;
