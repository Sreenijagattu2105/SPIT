/*
 * GoToTop.jsx
 * -----------
 * Displays a floating button that allows users to smoothly
 * scroll back to the top of the page.
 */

// Import React and hooks for managing component state and side effects.
import React, { useEffect, useState } from "react";

// Import the upward arrow icon from Lucide React.
import { ArrowUp } from "lucide-react";

/**
 * GoToTop component.
 *
 * Displays a floating button when the user scrolls down
 * more than 300 pixels from the top of the page.
 */
function GoToTop() {

    // Track whether the Go To Top button should be visible.
    const [visible, setVisible] = useState(false);

    /*
     * Monitor the page's scroll position.
     * Show or hide the button depending on the scroll position.
     */
    useEffect(() => {

        // Update button visibility based on the current scroll position.
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        // Listen for page scroll events.
        window.addEventListener("scroll", handleScroll);

        // Check the initial scroll position when the component mounts.
        handleScroll();

        // Remove the event listener when the component unmounts.
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Do not render the button when it is not needed.
    if (!visible) {
        return null;
    }

    /*
     * Render the floating button.
     * Clicking it smoothly scrolls the page to the top.
     */
    return (
        <button
            type="button"
            className="go-to-top"
            onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }
            aria-label="Go to top"
            title="Go to top"
        >
            {/* Display the upward arrow icon. */}
            <ArrowUp size={22} />
        </button>
    );
}

// Export the component for use in other files.
export default GoToTop;
