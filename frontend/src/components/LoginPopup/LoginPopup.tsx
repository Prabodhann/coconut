import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchCart } from '@/store/slices/cartSlice';
import { UI_CONTENT } from '@/constants/uiContent';
import { CONSTANTS } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginPopupProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ setShowLogin }) => {
  const dispatch = useAppDispatch();
  const [currState, setCurrState] = useState(UI_CONTENT.LOGIN.SIGN_UP_TITLE);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let new_url = CONSTANTS.API_URL;
    if (currState === UI_CONTENT.LOGIN.LOGIN_TITLE) {
      new_url += '/api/user/login';
    } else {
      new_url += '/api/user/register';
    }
    const payload =
      currState === UI_CONTENT.LOGIN.LOGIN_TITLE
        ? { email: data.email, password: data.password }
        : data;

    try {
      const response = await axios.post(new_url, payload);
      if (response.data.success) {
        dispatch(setAuth({ token: response.data.token, role: response.data.role ?? 'user' }));
        dispatch(fetchCart());
        setShowLogin(false);
        toast.success(currState === UI_CONTENT.LOGIN.LOGIN_TITLE ? "Welcome back!" : "Account created successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
        onClick={() => setShowLogin(false)}
      >
        <motion.div 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{currState}</h2>
            <button 
              onClick={() => setShowLogin(false)}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-zinc-600 dark:text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onLogin} className="space-y-6 relative">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currState === UI_CONTENT.LOGIN.SIGN_UP_TITLE && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      name="name"
                      onChange={onChangeHandler}
                      value={data.name}
                      type="text"
                      placeholder={UI_CONTENT.LOGIN.NAME_PLACEHOLDER}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder={UI_CONTENT.LOGIN.EMAIL_PLACEHOLDER}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type="password"
                  placeholder={UI_CONTENT.LOGIN.PASSWORD_PLACEHOLDER}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all dark:text-white"
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full py-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg shadow-lg hover:shadow-orange-500/25 transition-all text-center"
            >
              {currState === UI_CONTENT.LOGIN.LOGIN_TITLE ? UI_CONTENT.LOGIN.LOGIN_BTN : UI_CONTENT.LOGIN.CREATE_ACCOUNT_BTN}
            </Button>

            {currState === UI_CONTENT.LOGIN.SIGN_UP_TITLE && (
              <div className="flex items-start gap-3 mt-4">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 w-4 h-4 rounded text-orange-500 border-zinc-300 focus:ring-orange-500 cursor-pointer"
                />
                <p className="text-sm text-zinc-500 leading-tight">
                  {UI_CONTENT.LOGIN.TERMS_AGREEMENT}
                </p>
              </div>
            )}

            <div className="pt-4 text-center mt-2 border-t border-zinc-100 dark:border-zinc-800">
              {currState === UI_CONTENT.LOGIN.LOGIN_TITLE ? (
                <p className="text-zinc-600 dark:text-zinc-400">
                  {UI_CONTENT.LOGIN.CREATE_NEW_PROMPT}{' '}
                  <button type="button" onClick={() => setCurrState(UI_CONTENT.LOGIN.SIGN_UP_TITLE)} className="text-orange-500 font-semibold hover:underline">
                    {UI_CONTENT.LOGIN.CLICK_HERE}
                  </button>
                </p>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  {UI_CONTENT.LOGIN.ALREADY_HAVE_PROMPT}{' '}
                  <button type="button" onClick={() => setCurrState(UI_CONTENT.LOGIN.LOGIN_TITLE)} className="text-orange-500 font-semibold hover:underline">
                    {UI_CONTENT.LOGIN.LOGIN_HERE}
                  </button>
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPopup;
