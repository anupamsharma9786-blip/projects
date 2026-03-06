import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Protected = ({children}) => {


    const {user,loading} = useAuth();



    if(loading){
        return <h1>Loading...</h1>
    }

    else if(!user){
        return <Navigate to="/login" />
    }

  return children;
}

export default Protected
