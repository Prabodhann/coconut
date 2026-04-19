import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Dismiss all active toasts on route change
    toast.dismiss();

    if (hash) {
      // If there is a hash (e.g. #explore-menu), find the element and scroll to it
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // slight delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Regular page navigation - scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
