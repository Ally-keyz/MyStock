import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1738934353413.json"; // Adjust the path accordingly

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center">
      <Lottie animationData={animationData} loop={true} className="w-32 h-32" />
    </div>
  );
};

export default LoadingAnimation;