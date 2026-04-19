import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className='h-[100dvh] w-full overflow-hidden bg-gray-50 flex flex-col text-slate-800 transition-colors dark:bg-slate-950 dark:text-gray-100'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[18%] min-w-[200px] border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors overflow-y-auto">
          <Sidebar/>
        </div>
        
        <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50 relative overflow-y-auto custom-scrollbar p-6 transition-colors">
          <Routes>
            <Route path="/add" element={<Add/>}/>
            <Route path="/list" element={<List/>}/>
            <Route path="/orders" element={<Orders/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
