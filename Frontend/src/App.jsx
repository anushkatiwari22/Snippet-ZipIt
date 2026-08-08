import React from 'react'
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Outlet } from "react-router-dom";


const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App;
