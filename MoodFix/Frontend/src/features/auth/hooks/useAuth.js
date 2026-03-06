import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login,register,getMe, logout } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    const {user,setUser,loading,setLoading} = context;

    async function handleLogin(userDets,password){
        setLoading(true);

        const response = await login(userDets,password);

        setUser(response.user);

        setLoading(false);

    }

    async function handleRegister(username,email,password){
        setLoading(true);

        const response = await register(username,email,password);

        setUser(response.user);

        setLoading(false);

    }

    async function handleGetMe(username,password){
        setLoading(true);

        const response = await getMe();

        setUser(response.user);

        setLoading(false);

    }

    async function handleLogOut(username,password){
        setLoading(true);

        const response = await logout();

        setUser(null);

        setLoading(false);

    }

    useEffect(()=>{
        handleGetMe();
    },[])

    return{
        user,handleLogin,handleRegister,loading,handleGetMe,handleLogOut
    }
}
