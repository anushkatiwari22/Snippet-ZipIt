import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import Main from './Components/Main.jsx';
import LandingPage from './Components/LandingPage.jsx';
import Question from './Components/Question.jsx';
import Dashboard from './Components/Dashboard.jsx';
import AboutUs from './Components/AboutUs.jsx';
import ResumeAnalyser from './Components/ResumeAnalyser.jsx';
import LearningPlan from './Components/LearningPlan.jsx';
import Projects from './Components/Projects.jsx';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "questions",
        element: <Question />
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: <Main />
          },
          {
            path: "about",
            element: <AboutUs />
          },
          {
            path: "resume-analyser",
            element: <ResumeAnalyser />
          },
          {
            path: "learning-plan",
            element: <LearningPlan />
          },
          {
            path: "projects",
            element: <Projects />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(<RouterProvider router = {appRouter}/>)
