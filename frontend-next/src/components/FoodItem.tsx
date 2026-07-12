"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCartItem, removeCartItem } from "@/store/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Minus } from "lucide-react";

interface FoodItemProps {
  image: string;
  name: string;
  price: number;
  desc: string;
  id: string;
  isVeg?: boolean;
}

export function FoodItem({ image, name, price, desc, id, isVeg }: FoodItemProps) {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const itemCount = cartItems[id] || 0;

  const AddToCartControls = (
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
          aria-label={`Add ${name}`}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 hover:text-orange-500"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      ) : (
        <motion.div
          key="counter"
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg p-1 sm:p-1.5 border border-zinc-100 dark:border-zinc-700"
        >
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => dispatch(removeCartItem(id))}
            aria-label={`Remove ${name}`}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
          <span className="font-semibold w-3 sm:w-4 text-center text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
            {itemCount}
          </span>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => dispatch(addCartItem(id))}
            aria-label={`Add ${name}`}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-row sm:flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative w-32 shrink-0 sm:w-full sm:aspect-[4/3] aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
          src={image}
          alt={name}
        />

        <div className="hidden sm:block absolute bottom-4 right-4">
          {AddToCartControls}
        </div>
      </div>

      <div className="flex flex-col p-3 sm:p-5 flex-grow relative">
        <div className="flex justify-between items-start mb-1 sm:mb-2 pr-2">
          <div className="flex items-center gap-2">
            {isVeg !== undefined && (
              <div 
                className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-600'}`}
                title={isVeg ? "Veg" : "Non-Veg"}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>
            )}
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors line-clamp-2 sm:line-clamp-1">
              {name}
            </h3>
          </div>
          <div className="hidden sm:flex shrink-0 items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-500">
              4.5
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2 sm:mb-4 flex-grow">
          {desc}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
            ₹{price}
          </p>
          <div className="sm:hidden">
            {AddToCartControls}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
