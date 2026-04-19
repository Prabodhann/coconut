import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '@/assets/assets';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute w-24 h-24 border-4 border-t-orange-500 border-r-transparent border-b-green-500 border-l-transparent rounded-full opacity-40"
        />
        
        {/* Inner logo/identity pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white dark:bg-zinc-900 p-4 rounded-full shadow-2xl"
        >
          <motion.img
            src={assets.logo}
            alt="Coconut Logo"
            className="w-12 h-12 object-contain"
            animate={{
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Loading Text with character animation */}
      <div className="mt-8 flex items-center gap-1.5 overflow-hidden">
        {['C', 'o', 'c', 'o', 'n', 'u', 't'].map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              repeatDelay: 2
            }}
            className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-green-500"
          >
            {char}
          </motion.span>
        ))}
      </div>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="mt-2 text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] animate-pulse"
      >
        Waking up our culinary AI...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
