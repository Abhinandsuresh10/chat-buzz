import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';

interface AnimatedLottieProps extends LottieComponentProps {
  className?: string;
}

const AnimatedLottie: React.FC<AnimatedLottieProps> = ({ 
  animationData, 
  className = "", 
  ...lottieProps 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        delay: 0.5 
      }}
      whileHover={{ 
        scale: 1.1,
        transition: { type: "spring", stiffness: 200 }
      }}
      className={className}
    >
      <Lottie 
        animationData={animationData} 
        {...lottieProps} 
      />
    </motion.div>
  );
};

export default AnimatedLottie;