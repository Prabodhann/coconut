import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initial detection
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1 flex items-center transition-colors duration-300 focus:outline-none"
        >
            <motion.div
                animate={{ x: isDark ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center z-10"
            >
                {isDark ? (
                    <Moon className="w-3 h-3 text-orange-400" fill="currentColor" />
                ) : (
                    <Sun className="w-3 h-3 text-orange-500" fill="currentColor" />
                )}
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-between px-2 w-full h-full pointer-events-none">
                <Sun className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'}`} />
                <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30'}`} />
            </div>
        </button>
    );
};

export default ThemeToggle;
