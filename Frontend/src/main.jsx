import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import Home from './Components/Home.jsx';
import Question from './Components/Question.jsx';
import Dashboard from './Components/Dashboard.jsx';

const appRouter = createBrowserRouter([
  {
    path : "/",
    element : <App />,
    children : [
      {
        path : "/",
        element : <Home />
      },
      {
        path : "/signup",
        element : <Signup />
      },
      {
        path : "/login",
        element : <Login />
      },
      {
        path : "/questions",
        element : <Question />
      },{
        path : "/dashboard",
        element : <Dashboard />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(<RouterProvider router = {appRouter}/>)
