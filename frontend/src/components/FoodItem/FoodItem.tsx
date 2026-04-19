import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCartItem, removeCartItem } from '@/store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus } from 'lucide-react';

interface FoodItemProps {
  image: string;
  name: string;
  price: number;
  desc: string;
  id: string;
}

const FoodItem: React.FC<FoodItemProps> = ({ image, name, price, desc, id }) => {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector(state => state.cart);
  const itemCount = cartItems[id] || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
          src={image}
          alt={name}
        />
        
        {/* Floating Add to Cart Controls */}
        <div className="absolute bottom-4 right-4">
          <AnimatePresence mode="wait">
            {itemCount === 0 ? (
              <motion.button
                key="add-first"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(addCartItem(id))}
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 hover:text-orange-500"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 20 }}
                className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg p-1.5 border border-zinc-100 dark:border-zinc-700"
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => dispatch(removeCartItem(id))}
                  className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="font-semibold w-4 text-center text-sm text-zinc-900 dark:text-zinc-100">
                  {itemCount}
                </span>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => dispatch(addCartItem(id))}
                  className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-500">4.5</span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-grow">
          {desc}
        </p>
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
          ₹{price}
        </p>
      </div>
    </motion.div>
  );
};

export default FoodItem;
