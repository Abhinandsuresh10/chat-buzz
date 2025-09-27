// src/components/BackgroundAnimation.jsx
import Lottie from "lottie-react";
import bgAnimation from "../assets/Shapes Background.json";

function BackgroundAnimation() {
  return (
    <div className="fixed mt-60 inset-0 z-0">
      <Lottie 
        animationData={bgAnimation} 
        loop={true} 
        autoplay={true} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default BackgroundAnimation;
