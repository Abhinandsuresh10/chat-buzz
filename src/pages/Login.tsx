import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import GoogleButton from '../components/GoogleButton';
import { containerVariant } from '../animations/motionVariants';
import CatLove from "../assets/Cat feeling love emotionsexpression. Emojisticker animation.json"
import BackgroundAnimation from '../components/BackgroundAnimation';

const Login: React.FC = () => {
  return (
    <>
    {/* App Background Image... */}
    <BackgroundAnimation />
   
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50"
    >
      {/* Main Container */}
      <div className="relative w-full max-w-md md:max-w-lg">

        {/* Main Card - Increased padding bottom to make space for white card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl shadow-2xl pt-8 pb-32 md:pt-10 md:pb-36" // Increased pb-20 to pb-32
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-full mb-4 px-6" // Increased mb-2 to mb-4
          >
            {/* App Icon/Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-4xl mb-3"
            >
              💬
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2 text-center" // Increased mb-1 to mb-2
            >
              Chat-Buzz
            </motion.h1>

            {/* Subtitle - Made text smaller and reduced lines */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-purple-100 text-xs md:text-sm text-center px-2" // Reduced text size and added padding
            >
              Connect with friends
            </motion.p>
          </motion.div>

          {/* Features List - Reduced gap and margin */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mb-8 px-4" // Reduced gap-6 to gap-4, increased mb-6 to mb-8
          >
            {[
              { icon: "⚡", text: "Fast" },
              { icon: "🔒", text: "Secure" },
              { icon: "🎨", text: "Fun" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-white text-xl">{item.icon}</div> {/* Reduced text-2xl to text-xl */}
                <div className="text-purple-100 text-xs">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* White Login Card - Fixed positioning and size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.8
            }}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-full max-w-[280px] md:max-w-[320px] bg-white rounded-2xl shadow-xl border-2 border-white flex flex-col items-center p-4 md:p-5" // Fixed width and positioning
          >
            {/* Cat Animation - Properly Sized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="w-16 h-16 md:w-20 md:h-20 -mt-2 mb-1" // Reduced size and margin
            >
              <Lottie
                animationData={CatLove}
                loop={true}
              />
            </motion.div>

            {/* Welcome Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-gray-600 text-xs mb-2 text-center" // Reduced text size and margin
            >
              Join the conversation! 🐱
            </motion.p>

            {/* Google Button - Properly centered */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="w-full px-2" // Added horizontal padding
            >
              <div className="w-full flex justify-center">
              <GoogleButton />
              </div>
            </motion.div>

            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-gray-400 text-[10px] text-center mt-2" // Reduced text size
            >
              Your chats are end-to-end encrypted
            </motion.p>
          </motion.div>

          {/* Floating Chat Bubbles - Repositioned */}
          <motion.div
            className="absolute top-6 left-6" // Moved down from top-4
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/20 rounded-full p-2">
              <span className="text-white">💭</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-6 right-6" // Moved down from top-4
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div className="bg-white/20 rounded-full p-2">
              <span className="text-white">✉️</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </motion.div>
     </>
  );
};

export default Login;