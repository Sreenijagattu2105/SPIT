/*
 * CoordinatorLayout.jsx
 * ---------------------
 * Defines the common layout for coordinator pages.
 * Displays the CoordinatorNavbar at the top and renders
 * the active child route using React Router's Outlet.
 */

// Import Outlet to render the active child route.
import { Outlet } from "react-router-dom";

// Import the coordinator navigation bar.
import CoordinatorNavbar from "./CoordinatorNavbar";

/**
 * CoordinatorLayout component.
 *
 * Provides a shared layout for all coordinator pages.
 */
export default function CoordinatorLayout() {
    return (
        <>
            {/* Display the coordinator navigation bar at the top. */}
            <CoordinatorNavbar />

            {/* Render the component associated with the active route. */}
            <Outlet />
        </>
    );
}
