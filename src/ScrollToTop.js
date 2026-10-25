/*
 * ScrollToTop.jsx
 * ---------------
 * This component automatically scrolls the page to the top
 * whenever the user navigates to a different route.
 */

// Import the useEffect hook from React
import { useEffect } from "react";

// Import useLocation to access the current route information
import { useLocation } from "react-router-dom";

/*
 * Main ScrollToTop component.
 */
function ScrollToTop() {
    // Get the pathname of the current route
    const { pathname } = useLocation();

    /*
     * Scroll to the top whenever the pathname changes.
     */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // This component performs an action without rendering any UI
    return null;
}

// Export the component for use in App.js
export default ScrollToTop;
