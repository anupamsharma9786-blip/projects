import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";

export const AppRoute = createBrowserRouter([
    {
        path:"/dashboard",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
    
])