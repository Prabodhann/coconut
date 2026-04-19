import React from 'react';
import { menu_list } from '@/assets/assets';
import { UI_CONTENT } from '@/constants/uiContent';
import { motion } from 'framer-motion';

interface ExploreMenuProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
  return (
    <div className="flex flex-col gap-4" id="explore-menu">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {UI_CONTENT.EXPLORE_MENU.TITLE}
        </h2>
        <p className="max-w-[600px] text-zinc-500 md:text-lg/relaxed dark:text-zinc-400">
          {UI_CONTENT.EXPLORE_MENU.DESCRIPTION}
        </p>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide pt-2">
        {/* "All" Category Filter */}
        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => setCategory(UI_CONTENT.EXPLORE_MENU.ALL_FILTER)}
           className={`flex flex-col items-center gap-3 cursor-pointer min-w-[100px] p-2 rounded-2xl transition-all ${
             category === UI_CONTENT.EXPLORE_MENU.ALL_FILTER ? 'bg-orange-50 dark:bg-orange-500/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
           }`}
         >
           <div
             className={`w-20 h-20 rounded-full p-1 transition-all duration-300 ${
               category === UI_CONTENT.EXPLORE_MENU.ALL_FILTER
                 ? 'bg-gradient-to-tr from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                 : 'bg-zinc-200 dark:bg-zinc-700'
             }`}
           >
             <div className="w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 text-orange-500 font-bold text-lg italic">
               {UI_CONTENT.EXPLORE_MENU.ALL_FILTER}
             </div>
           </div>
           <p className={`text-sm font-medium transition-colors ${category === UI_CONTENT.EXPLORE_MENU.ALL_FILTER ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
             {UI_CONTENT.EXPLORE_MENU.ALL_FILTER}
           </p>
         </motion.div>

        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;
          return (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? 'All' : item.menu_name
                )
              }
              key={index}
              className={`flex flex-col items-center gap-3 cursor-pointer min-w-[100px] p-2 rounded-2xl transition-all ${
                isActive ? 'bg-orange-50 dark:bg-orange-500/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full p-1 transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    : 'bg-transparent'
                }`}
              >
                <img
                  src={item.menu_image}
                  className="w-full h-full object-cover rounded-full bg-white dark:bg-zinc-800"
                  alt={item.menu_name}
                />
              </div>
              <p
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {item.menu_name}
              </p>
            </motion.div>
          );
        })}
      </div>
      <hr className="border-t border-zinc-200 dark:border-zinc-800 my-2" />
    </div>
  );
};

export default ExploreMenu;
