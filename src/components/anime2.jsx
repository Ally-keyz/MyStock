import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1739293165000"; // Adjust the path accordingly

const LoadingAnimation = () => {
  return (
    <div className="flex ml-[200px] justify-center">
      <Lottie animationData={animationData} loop={true} className="w-32 h-32" />
    </div>
  );
};

export default LoadingAnimation;