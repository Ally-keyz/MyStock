import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import render from "../assets/logo2.png";
import Landing from './Landing';
import LoadingAnimation from '../components/anime';

function Render() {
    const [count, setCount] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setCount(1);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (count === 0) {
        return (
            <div className="relative flex items-center justify-center w-screen h-screen bg-gray-300 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
                
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMDAwMCI+PC9yZWN0PjxsaW5lIHgxPSIxMDAiIHkxPSIwIiB4Mj0iMTAwIiB5Mj0iMjAwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIwIiB5MT0iMTAwIiB4Mj0iMjAwIiB5Mj0iMTAwIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjwvc3ZnPg==')] opacity-10 pointer-events-none"></div>

                {/* Main Content Container */}
                <div className="relative z-10 flex  flex-col items-center space-y-8">

                    {/* Loading Container */}
                    <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/30 rounded-xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center space-y-4">
                            <p className='text-[25px] font-semibold text-white'>Ihunikiro System</p>
                            
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-blue-400 mb-2">
                                    Loading
                                    <span className="inline-block ml-1 space-x-1">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <span 
                                                key={i}
                                                className="inline-block animate-bounce"
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            >.</span>
                                        ))}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Preparing your experience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    } else {
        return (
            <div>
                <Landing />
            </div>
        );
    }
}

export default Render;