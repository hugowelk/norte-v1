import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the window scroll position to the top whenever the route changes.
 * Without this, navigating between pages can leave the new page scrolled
 * mid-way, which feels like a glitch.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
