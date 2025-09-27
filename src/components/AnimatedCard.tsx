import React from 'react'
import { motion } from 'framer-motion'
import { slideUpVariant } from '../animations/motionVariants';


interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = "", delay = 0}) => {
  return (
     <motion.div
      variants={slideUpVariant}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
