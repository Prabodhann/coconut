import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { url } from '../../assets/assets';
import { saveAdminSession } from '../../services/api';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success && response.data.role === 'admin') {
        saveAdminSession(response.data.token, response.data.role);
        toast.success('Welcome back, Admin!');
        onLogin();
      } else if (response.data.success) {
        toast.error('Access denied. Admin privileges required.');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 transition-colors"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Coconut<span className="text-orange-500">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              required
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
