import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link, Navigate, useNavigate } from 'react-router'
import "../../shared/style/global.scss"
import "../styles/login.scss"
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  
  if(user){
    navigate("/");
  }

  const {loading,handleLogin} = useAuth()

  const [userDets, setUserDets] = useState("");
  const [password, setPassword] = useState("");

  

  const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(password);
    console.log(userDets);
    
    
    await handleLogin(userDets,password);

    navigate("/");
  }

  return (
    <main>
      
        <div className="form-container">
          <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input onChange={(e)=>{setUserDets(e.target.value)}} value={userDets} type="text" placeholder='Enter username or email' />
          <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" placeholder='Enter password' />
          <button>Login</button><p>Don't have an account?</p><Link to="/register">Register</Link>
        </form>
      </div>
    </main>
  )
}

export default Login
