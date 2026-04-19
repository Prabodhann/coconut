import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '@/assets/assets';
import { UI_CONTENT } from '@/constants/uiContent';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTS } from '@/constants';
import { toast } from 'react-toastify';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

const AppDownload: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(`${CONSTANTS.API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        toast.success('Registration successful! Check your email. 🥥');
        setEmail('');
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="my-10" id="app-download">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-5xl mx-auto rounded-[3rem] bg-zinc-900 border border-zinc-800 overflow-hidden relative"
      >
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[200px] bg-orange-500/30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-6 py-12 md:py-16 flex flex-col items-center text-center space-y-10">
          
          <div className="space-y-6 max-w-2xl">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
              dangerouslySetInnerHTML={{ 
                __html: UI_CONTENT.APP_DOWNLOAD.TEXT
                  .replace(' Download ', '<br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Download</span><br />') 
              }}
            />
            <p className="text-zinc-400 md:text-lg">
              Get the full Coconut experience in the palm of your hand. Fast delivery, exclusive deals, and easy tracking.
            </p>
          </div>

          {/* Email Subscription Form */}
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 flex flex-col items-center space-y-3"
                >
                  <CheckCircle2 className="w-10 h-10 text-orange-500" />
                  <p className="text-white font-semibold">You're on the list!</p>
                  <p className="text-zinc-400 text-sm italic">Check your inbox for a special message from Coconut.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-orange-500 text-sm hover:underline mt-2"
                  >
                    Register another email
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="relative group"
                >
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl focus-within:border-orange-500/50 transition-all shadow-2xl">
                    <input 
                      type="email" 
                      placeholder="Enter your email for early access" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      className="bg-transparent flex-1 px-4 py-3 text-white placeholder:text-zinc-500 outline-none w-full"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Notify Me
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-zinc-500 text-xs mt-3">We only send delicious updates. No spam, ever.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link to="/app-download" className="block group">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-800 p-1.5 rounded-2xl border border-zinc-700 shadow-xl group-hover:border-zinc-500 transition-colors">
                  <img src={assets.play_store} alt="Play Store" className="h-10 md:h-12 w-auto object-contain" />
                </div>
              </motion.div>
            </Link>
            <Link to="/app-download" className="block group">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-800 p-1.5 rounded-2xl border border-zinc-700 shadow-xl group-hover:border-zinc-500 transition-colors">
                  <img src={assets.app_store} alt="App Store" className="h-10 md:h-12 w-auto object-contain" />
                </div>
              </motion.div>
            </Link>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default AppDownload;
