import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Components/Signup.jsx";
import Login from "./Components/Login.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import Question from "./Components/Question.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import AboutUs from "./Components/AboutUs.jsx";
import ResumeAnalyser from "./Components/ResumeAnalyser.jsx";
import LearningPlan from "./Components/LearningPlan.jsx";
import Projects from "./Components/Projects.jsx";
import DashboardOverview from "./Components/DashboardOverview.jsx";
import TechPulse from "./Components/TechPulse.jsx";
import Profile from "./Components/Profile.jsx";
import "react-toastify/ReactToastify.css";
import ChangePassword from "./Components/ChangePassword.jsx";
import LearningQuize from "./Components/LearningQuize.jsx";
import "react-toastify/ReactToastify.css";
import NextMonthPlan from "./Components/NextMonthPlan.jsx"
import Contact from "./Components/Contact.jsx";
import NotFound from "./Components/NotFound.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "questions",
        element: <Question />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: <DashboardOverview />,
          },
          {
            path: "about",
            element: <AboutUs />,
          },
          {
            path : "contact" ,
            element: <Contact/>
          },
          {
            path: "resume-analyser",
            element: <ResumeAnalyser />,
          },
          {
            path: "learning-plan",
            element: <LearningPlan />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path : "nextmonthplan",
            element : <NextMonthPlan/>
          } ,
          {
            path : "learningquize/:week" ,
            element : <LearningQuize />
          }
        ],
      },
      {
        path : "*" , 
        element : <NotFound/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter} />,
);
