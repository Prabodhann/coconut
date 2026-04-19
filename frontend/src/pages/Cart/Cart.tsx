import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeCartItem, addCartItem } from '@/store/slices/cartSlice';
import { UI_CONTENT } from '@/constants/uiContent';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { list: foodList } = useAppSelector((state) => state.food);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const handleRemove = (id: string) => {
    dispatch(removeCartItem(id));
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 5;
  const total = subtotal + deliveryFee;

  const hasItems = subtotal > 0;

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3 mb-8">
        <ShoppingBag className="w-8 h-8 text-orange-500" />
        Your Cart
      </h1>

      {!hasItems ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-6"
        >
          <div className="bg-orange-50 dark:bg-orange-500/10 p-6 rounded-full">
            <ShoppingBag className="w-16 h-16 text-orange-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Your cart is empty</h2>
            <p className="text-zinc-500 max-w-sm mx-auto">Looks like you haven't added any delicious coconut treats yet.</p>
          </div>
          <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-orange-500/25">
            Explore Menu
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <AnimatePresence>
                  {foodList.map((item) => {
                    if (cartItems[item._id] > 0) {
                      return (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 bg-white dark:bg-zinc-900"
                        >
                          {/* Mobile Layout */}
                          <div className="md:hidden flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-zinc-100 dark:border-zinc-800" />
                              <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</h3>
                                <p className="text-sm text-zinc-500">₹{item.price}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/80 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                              <button onClick={() => handleRemove(item._id)} className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center text-zinc-900 dark:text-zinc-100">{cartItems[item._id]}</span>
                              <button onClick={() => dispatch(addCartItem(item._id))} className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-500 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex flex-row col-span-6 items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-zinc-100 dark:border-zinc-800" />
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</h3>
                          </div>
                          
                          <div className="hidden md:block col-span-2 text-center text-zinc-600 dark:text-zinc-400 font-medium">
                            ₹{item.price}
                          </div>
                          
                          <div className="hidden md:flex col-span-2 justify-center">
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                              <button onClick={() => handleRemove(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:text-red-500 shadow-sm transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-semibold w-6 text-center text-zinc-900 dark:text-zinc-100">
                                {cartItems[item._id]}
                              </span>
                              <button onClick={() => dispatch(addCartItem(item._id))} className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:text-green-500 shadow-sm transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="hidden md:flex col-span-2 justify-end items-center gap-4">
                            <span className="font-semibold text-orange-600 dark:text-orange-500 text-lg">₹{item.price * cartItems[item._id]}</span>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Checkout Totals */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
            >
              <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">{UI_CONTENT.PLACE_ORDER.TOTAL_HEADER}</h2>
              
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">₹{subtotal}</p>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex justify-between items-center">
                  <p>Delivery Fee</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">₹{deliveryFee}</p>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex justify-between items-center text-lg">
                  <b className="text-zinc-900 dark:text-zinc-100">Total</b>
                  <b className="text-orange-600 dark:text-orange-500 text-2xl">₹{total}</b>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/order')}
                className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full py-6 text-lg group"
              >
                {UI_CONTENT.CART.CHECKOUT_BUTTON}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed"
            >
              <p className="text-sm text-zinc-500 mb-3">{UI_CONTENT.CART.PROMO_CODE_PROMPT}</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="promo code" 
                  className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                />
                <Button variant="secondary" className="rounded-xl px-6 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600">
                  Submit
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
