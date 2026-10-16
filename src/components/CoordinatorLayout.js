import { Outlet } from "react-router-dom";
import CoordinatorNavbar from "./CoordinatorNavbar";

export default function CoordinatorLayout() {
    return (
        <>
            <CoordinatorNavbar />
            <Outlet />
        </>
    );
}
