import React, { useState } from 'react'
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Outlet } from "react-router-dom";
import UserContext from './utils/UserContext';


const App = () => {

  const [verficationObj , setVerficationObj] = useState({});
  return (
    <UserContext.Provider value = {{obj : verficationObj , setObj : setVerficationObj}}>
      <div>
        <Outlet />
      </div>
    </UserContext.Provider>

  )
}

export default App;
