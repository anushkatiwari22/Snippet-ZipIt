import React, { useEffect, useRef, useState } from 'react'
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import UserContext from './utils/UserContext';
import { ToastContainer } from 'react-toastify';
import useVerfiyToken from './utils/useVerifyToken';


const App = () => {

  // const [isAuthenticated , setIsAuthenticated] = useState(false)
  const [verficationObj , setVerficationObj] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const checkAuth = async () => {
    const verifyObj = await verifyToken();

    const path = location.pathname;
    if(verifyObj && verifyObj?.success == "true") {
      setVerficationObj(verifyObj);
      if(path.includes('login') || path.includes('signup') || path == "/"){
        navigate("/dashboard/home");
      }
    } else {
      if(path === "/"){
        navigate("/");
      } else if(path.includes('signup')){
        navigate("/signup");
      } else {
        navigate("/login");
      }
    }
  }
  checkAuth();
},[]);

async function verifyToken() {
  const obj = await useVerfiyToken();
  return obj;
}

  return (
    <UserContext.Provider value = {{obj : verficationObj , setObj : setVerficationObj}}>
      <ToastContainer/>
      <div> 
        <Outlet />
      </div>
    </UserContext.Provider>

  )
}

export default App;
