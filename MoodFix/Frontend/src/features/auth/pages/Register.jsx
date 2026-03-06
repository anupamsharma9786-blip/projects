import React,{useState} from 'react'
import "../styles/register.scss";
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Register = () => {
  const {handleRegister,loading} = useAuth()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    
    e.preventDefault();

    await handleRegister(username,email,password);

    navigate("/");

  }

  return (
    <main>
        <div className="form-container">
          <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input onChange={(e)=>{setUsername(e.target.value)}} value={username} type="text" placeholder='Enter username' />
          <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type="email" placeholder='Enter email' />
          <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" placeholder='Enter password' />
          <button>Register</button><p>Already have an account?</p><Link to="/login">Login</Link>
        </form>
      </div>
    </main>
  )
}

export default Register
