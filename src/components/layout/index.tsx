import React from "react";
import { Outlet } from "react-router-dom";
const Layout = () => {
    return (
        <div>
            <div className="px-12">
                <Outlet />
            </div>
        </div>
    )
}
export default Layout;