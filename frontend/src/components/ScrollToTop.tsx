import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Dismiss all active toasts on route change
    toast.dismiss();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
