import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFoodList } from '@/store/slices/foodSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const LoginPopup = lazy(() => import('./components/LoginPopup/LoginPopup'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder/PlaceOrder'));
const MyOrders = lazy(() => import('./pages/MyOrders/MyOrders'));
const Verify = lazy(() => import('./pages/Verify/Verify'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchFoodList());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  return (
    <>
    <ToastContainer/>
    <Suspense fallback={null}>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : null}
    </Suspense>
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/cart' element={<Cart />}/>
            <Route path='/order' element={<PlaceOrder />}/>
            <Route path='/myorders' element={<MyOrders />}/>
            <Route path='/verify' element={<Verify />}/>
            <Route path='/profile' element={<Profile />}/>
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

export default App
