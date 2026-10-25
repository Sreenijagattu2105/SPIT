/*
 * reportWebVitals.js
 * ------------------
 * Collects web performance metrics and passes them
 * to a callback function when one is provided.
 */

/**
 * Collects web performance metrics using the web-vitals library.
 *
 * @param {Function} onPerfEntry - Callback function that receives
 *                                 the collected performance metrics.
 */
const reportWebVitals = (onPerfEntry) => {

    // Collect metrics only when a valid callback function is provided.
    if (
        onPerfEntry &&
        onPerfEntry instanceof Function
    ) {

        /*
         * Dynamically import the web-vitals library.
         * This loads the library only when performance monitoring
         * is requested.
         */
        import("web-vitals").then(
            ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {

                // Measure Cumulative Layout Shift.
                getCLS(onPerfEntry);

                // Measure First Input Delay.
                getFID(onPerfEntry);

                // Measure First Contentful Paint.
                getFCP(onPerfEntry);

                // Measure Largest Contentful Paint.
                getLCP(onPerfEntry);

                // Measure Time to First Byte.
                getTTFB(onPerfEntry);
            }
        );
    }
};

// Export the function for use in the application entry point.
export default reportWebVitals;
