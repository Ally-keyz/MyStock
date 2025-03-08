import React from 'react';
import Notification from '../components/Notification';
import Spinner from '../components/Spinner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { ACCESS_TOKEN } from '../constants';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import render from "../assets/log.png";
import vid from "../assets/vid.mp4";
import LoadingAnimation from '../components/anime2';
import logo from "../assets/logo.png";
import Modal from '../components/Modal';

function Landing() {
    const [nameMail, setNameMail] = useState('');
    const [Password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [color, setColor] = useState("bg-red-500");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal2 = () => setModalOpen(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const navigate = useNavigate();

    const triggerNotification = (message, color) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setColor(color);
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
    };

    const HandleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setModalOpen(true);

        if (!nameMail || !Password) {
            triggerNotification("Please enter a name and password", "bg-red-500");
            setIsLoading(false);
            setModalOpen(false);
            return;
        }

        try {
            const res = await axios.post('https://stock-managment-2.onrender.com/users/login', {
                email: nameMail,
                password: Password
            });

            if (res && res.data) {
                localStorage.setItem("ACCESS_TOKEN", res.data.token);
                localStorage.setItem("USER", JSON.stringify(res.data.user));
                navigate('/Home');
            } else {
                triggerNotification('Failed to login', "bg-red-500");
            }
        } catch (e) {
            if (e.status === 401) {
                triggerNotification(`Unauthorized please register`, "bg-red-500");
            } else if (e.status === 400) {
                triggerNotification(`Not found`, "bg-red-500");
            } else {
                triggerNotification(`Error ${e.message} while logging in`, "bg-red-500");
            }
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    return (
        <>
            <Navbar />
            {/* Notification */}
            {showNotification && (
                <Notification
                    message={notificationMessage}
                    color={color}
                    duration={5000}
                    onClose={handleNotificationClose}
                />
            )}

            <div className='sm:h-full h-screen w-full flex bg-gradient-to-r from-zinc-50 to-white justify-center items-center relative overflow-hidden'>

                {/* Animated Blobs */}
                <div className="absolute w-80 h-80 bg-gray-900 rounded-full opacity-30 animate-pulse -top-40 -left-40"></div>
                <div className="absolute w-96 h-96 bg-white rounded-full opacity-30 animate-pulse -bottom-40 -right-40"></div>
                <div className="absolute w-64 h-64 bg-blue-500 rounded-full opacity-30 animate-pulse top-[320px] left-10"></div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,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')] opacity-10 pointer-events-none"></div>

                {/* Main Content Container with Responsive Left Offset */}
                <div className="flex flex-col relative sm:left-[200px] left-0 mt-5 sm:flex-row justify-center items-center w-full z-10">
                    {/* Video Section */}
                    <div className="hidden sm:block sm:w-[300px] relative shadow-lg h-[430px] mt-5">
                        <video
                            src={vid}
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover rounded-l-md"
                        />
                        {/* Mask Overlay */}
                        <div className="absolute inset-0 bg-black rounded-l-md bg-opacity-65 flex items-center justify-center">
                            <div className="">
                                <p className='text-blue-500 ml-5 font-bold text-[19px]'>MINAGRI STOCK</p>
                                <p className='text-white font-semibold text-[19px]'>MANAGMENT SYSTEM</p>
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="flex justify-center shadow-lg mt-5 bg-white  rounded-r-md w-full sm:w-[440px] h-[430px]">
                        <div>
                            <div className="flex justify-center mt-7 mb-8">
                                <p className='text-green-900 font-bold text-[17px]'>
                                    <img src={logo} className='w-20 h-20' alt="" />
                                </p>
                            </div>

                            <input
                                type="text"
                                value={nameMail}
                                onChange={(e) => setNameMail(e.target.value)}
                                className="block bg-white border-gray-500 border rounded-full w-full sm:w-[335px] px-[25px] py-2 mb-8 text-[16px] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                                placeholder="Email or name"
                            />
                            <div className="relative w-full">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block bg-white border-gray-500 border rounded-full w-full sm:w-[335px] px-[25px] py-2 mb-2 text-[16px] text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-blue-800 focus:border-blue-800"
                                    placeholder="Password"
                                />
                                <div
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                >
                                    {isPasswordVisible ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="text-center text-[14px] mt-4 text-blue-600 font-semibold">
                                    Forgot password <span className='text-gray-700 text-[14px] font-semibold cursor-pointer'>reset here</span>
                                </div>
                            </div>

                            <Link onClick={HandleLogin} className="flex sm:mt-[-20px] justify-center w-full">
                                <div className="duration-500 hover:scale-105 transition-all text-center text-white bg-gradient-to-tr from-blue-500 to-blue-600 pt-2 mt-10 text-[15px] font-bold rounded-full cursor-pointer w-full items-center h-[42px]">
                                    {isLoading ? "Processing..." : 'Login'}
                                </div>
                            </Link>
                            <div className="flex justify-center">
                                <div className="text-center text-[14px] mt-4 text-gray-700 font-semibold">
                                    @ Powered by minagri
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-screen bg-gradient-to-r from-gray-900 flex justify-center items-center to-zinc-600"></div>
            </div>
            <Modal isOpen={modalOpen} onClose={closeModal2}>
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
                                    Logging In
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
                                Cancel Login
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
            </Modal>
        </>
    );
}

export default Landing;
