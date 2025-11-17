import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Loyalty from "@/pages/dashboard/loyalty";
import Affilate from "@/pages/dashboard/affilate";
export const router = createBrowserRouter([
    {
        path :"/",
        element :<Loyalty/>
    },{
        path:"/affilate",
        element: <Affilate/>
    }




    
    
]);
//    {
//         path: "/",
//         element: <Login />
//     },
//     {
//         path: "/register",
//         element: <Register />
//     }
//     ,
//     {
//         path: "/dashboard",
//         element: <DashboardLayout />,
//         children:[
//             {
//                 path: "/dashboard/overview",
//                 element: <DashBoard />
//             },
//             {
//                 path: "/dashboard/loyalty",
//                 element: <Loyalty />
//             },
//             {
//                 path: "/dashboard/affilate",
//                 element: <Affilate />
//             }
//             ,
//             {
//                 path: "/dashboard/settings",
//                 element: <Settings />
//             }
//         ]
//     }