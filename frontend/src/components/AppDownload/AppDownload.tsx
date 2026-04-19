import { Link } from 'react-router-dom';
import { assets } from '@/assets/assets';
import { UI_CONTENT } from '@/constants/uiContent';
import { motion } from 'framer-motion';

const AppDownload: React.FC = () => {
  return (
    <div className="my-24" id="app-download">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-5xl mx-auto rounded-[3rem] bg-zinc-900 border border-zinc-800 overflow-hidden relative"
      >
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[200px] bg-orange-500/30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-6 py-20 md:py-28 flex flex-col items-center text-center space-y-12">
          
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/app-download" className="block group">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-800 p-1.5 rounded-2xl border border-zinc-700 shadow-xl group-hover:border-zinc-500 transition-colors">
                  <img src={assets.play_store} alt="Play Store" className="h-12 md:h-14 w-auto object-contain" />
                </div>
              </motion.div>
            </Link>
            <Link to="/app-download" className="block group">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-zinc-800 p-1.5 rounded-2xl border border-zinc-700 shadow-xl group-hover:border-zinc-500 transition-colors">
                  <img src={assets.app_store} alt="App Store" className="h-12 md:h-14 w-auto object-contain" />
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
