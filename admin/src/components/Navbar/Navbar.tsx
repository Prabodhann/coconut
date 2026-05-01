import React from 'react';
import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut } from 'lucide-react';

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onLogout }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center py-3 px-[4%] bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm z-50 sticky top-0 transition-colors"
    >
      <div className="flex items-center gap-2">
         <img className="w-[120px] lg:w-[150px] object-cover dark:brightness-[0.8] dark:contrast-[1.2]" src={assets.logo} alt="logo" />
         <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded border border-orange-200 dark:border-orange-500/30">Admin Panel</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 relative overflow-hidden"
          aria-label="Toggle Dark Mode"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOut size={20} />
          </button>
        )}

        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-orange-500 dark:border-orange-400 cursor-pointer hover:shadow-md transition-shadow">
          <img className="w-full h-full object-cover" src={assets.profile_image} alt="profile" />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
