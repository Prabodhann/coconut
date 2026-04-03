import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFoodList } from "@/store/slices/foodSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CONSTANTS } from "@/constants";

// Lazy loaded components
const Home = lazy(() => import("./pages/Home/Home"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const LoginPopup = lazy(() => import("./components/LoginPopup/LoginPopup"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder/PlaceOrder"));
const MyOrders = lazy(() => import("./pages/MyOrders/MyOrders"));
const Verify = lazy(() => import("./pages/Verify/Verify"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const MobileApps = lazy(() => import("./pages/MobileApps/MobileApps"));

/**
 * Silently pings the backend /health endpoint as soon as the app loads.
 * On Render free tier, the server sleeps after 15 min of inactivity.
 * This warm-up ping starts the wake process immediately, so by the time
 * the user clicks anything the server is already awake.
 * If no response within 4s, shows a friendly toast.
 */
async function warmUpServer() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(`${CONSTANTS.API_URL}/health`, { signal: controller.signal });
  } catch {
    // Server is waking up — notify the user to wait a moment
    toast.info("🌴 Server is waking up... first load may take ~30 seconds.", {
      autoClose: 8000,
      position: "bottom-center",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  // Warm up the Render backend on first load (handles free-tier sleep)
  useEffect(() => {
    warmUpServer();
  }, []);

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
      <ToastContainer />
      <Suspense fallback={null}>
        {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      </Suspense>
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/app-download" element={<MobileApps />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default App;
