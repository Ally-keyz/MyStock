import React from 'react'
import Notification from '../components/Notification'
import Spinner from '../components/Spinner'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { ACCESS_TOKEN } from '../constants';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Landing() {
    const [nameMail, setNameMail] = useState('');
    const [Password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };
    const navigate = useNavigate(); 
  
    const triggerNotification = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
    };
  
    const handleNotificationClose = () => {
        setShowNotification(false);
    };


    const HandleLogin = async (e) => {
        e.preventDefault();  // Fix here
        setIsLoading(true);

        if (!nameMail || !Password) {
            triggerNotification("Please enter a name and password");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/users/login', {
                email: nameMail,  // Change this according to what your API expects
                password: Password
            });

            if (res && res.data) {  // Checking if response contains data
                localStorage.setItem("ACCESS_TOKEN", res.data.token);
                localStorage.setItem("USER",JSON.stringify(res.data.user))
                console.log(res.data.user)
                navigate('/Home');
            } else {
                triggerNotification('Failed to login');
            }
        } catch (e) {
            if(e.status === 401){
                triggerNotification(`Unauthorized please register`);
            }else if(e.status == 400){
                triggerNotification(`not found`);
            }
            else{
                triggerNotification(`Error ${e.message} while logging in`);
            }
        } finally {
            setIsLoading(false);
        }
    };
  return (
    <>
    
        <div className='sm:h-[585px] h-screen w-full flex sm:p-5 justify-center  bg-gray-50 '>
      
                    {/* Notification */}
                    {showNotification && (
                <Notification
                    message={notificationMessage}
                    duration={5000}  // Optional custom duration
                    onClose={handleNotificationClose}
                />
            )}
            <div className="">
        <div className="flex justify-center border-l border-b p-5 mt-20 bg-white border-blue-300  top-24  rounded-md shadow-xl w-full sm:w-[440px] h-[410px]  ">
            <div className="">
            <div className=" mt-5 text-center mb-10 text-[17px] text-blue-500 font-bold">MyStock</div>
            
            <input
        type="text"
        value={nameMail}
        onChange={(e) => setNameMail(e.target.value)}
        className="block border-b  border-gray-400 w-full sm:w-[320px] px-[25px] py-2 mb-8 text-[13px] text-gray-600 shadow-sm rounded-sm mt-2  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Email or name"
      />
    <div className="relative w-full">
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        value={Password}
        onChange={(e)=>setPassword(e.target.value)}
        className="block border-b border-gray-400 w-full  sm:w-[320px] px-[25px] py-2 text-[13px] text-gray-600 shadow-sm rounded-sm mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Password"
      />
      <div
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
      >
        {isPasswordVisible ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
      </div>
    </div>

       <Link onClick={HandleLogin} className="transition-colors flex justify-center w-full duration-500 hover:bg-white">
       <div  className="text-center  text-white bg-gradient-to-l from-blue-400 to-indigo-400 pt-1 mt-16    text-[15.5px] font-bold rounded cursor-pointer     w-64 h-[35px] ">
       {isLoading ? <Spinner  />: 'Login'}
       </div>  
            </Link>
            <div className="flex justify-center">
            <div className="tex-center text-[10px] mt-4  text-blue-400 font-semibold">
                Enter your credentials 
            </div>
            </div>
            </div>
            </div>
            </div>
    </div>
    </>
  )
}

export default Landing