import { useState, useEffect, useRef } from 'react';
import close from '../assets/closeB.png';

const Notification = ({ message, duration = 7000, onClose, color = "bg-red-600" }) => {
  const [show, setShow] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    // Trigger notification slide-in
    setShow(true);

    // Start progress bar animation after mount
    setTimeout(() => {
      if (progressRef.current) {
        progressRef.current.style.transition = `width ${duration}ms linear`;
        progressRef.current.style.width = "0%";
      }
    }, 50);

    // Auto-close after the provided duration
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-10 right-5 z-50 w-96 p-5 ${color} text-white shadow-xl rounded-xl transform transition-all duration-500 ease-in-out ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } hover:shadow-2xl`}
    >
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setShow(false);
            if (onClose) onClose();
          }}
          className="ml-4 hover:text-gray-200 transition-colors duration-300"
        >
          <img src={close} alt="Close notification" className="w-4 h-4" />
        </button>
      </div>
      <div className="w-full bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-white"
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default Notification;
