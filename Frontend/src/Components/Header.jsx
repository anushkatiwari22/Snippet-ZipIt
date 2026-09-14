import UserContext from "../utils/UserContext";
import { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorClosed,
  faFile,
  faHouse,
  faInfo,
  faLightbulb,
  faMessage,
  faPhone,
  faRoad,
  faSignOut,
  faTableCellsLarge,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium tracking-normal transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  }`;


const Header = () => {

  const {obj , setObj} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async(e)=>{

    const response = await fetch("http://localhost:3000/logout" , {
      method : "GET" ,
      credentials : "include" ,
      headers : {
        "Content-Type" : "application/json"
      } ,
    })
    // const data = await response.json();
    if(response.ok){
      setObj(null);
      navigate("/login");
    }
  }
  return (
    <div className="font-display h-full flex flex-col bg-white p-4">
      <div className="flex items-center gap-2 mb-8 px-1">
        <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          Solvi
        </h1>
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold px-3 mb-1">
            Main
          </h3>
          <NavLink to="/dashboard/home" className={navItemClass}>
            <FontAwesomeIcon icon={faHouse} className="w-4 text-center" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard/resume-analyser" className={navItemClass}>
            <FontAwesomeIcon icon={faFile} className="w-4 text-center" />
            <span>Resume Analyser</span>
          </NavLink>
          <NavLink to="/dashboard/learning-plan" className={navItemClass}>
            <FontAwesomeIcon icon={faRoad} className="w-4 text-center" />
            <span>Learning Plan</span>
          </NavLink>
          <NavLink to="/dashboard/projects" className={navItemClass}>
            <FontAwesomeIcon icon={faLightbulb} className="w-4 text-center" />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/mock-interview" className={navItemClass}>
            <FontAwesomeIcon icon={faMessage} className="w-4 text-center" />
            <span>Mock Interview</span>
          </NavLink>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold px-3 mb-1">
            Account
          </h3>
          <NavLink to="/dashboard/profile" className={navItemClass}>
            <FontAwesomeIcon icon={faUser} className="w-4 text-center" />
            <span>Profile</span>
          </NavLink>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-100 hover:text-red-500 cursor-pointer">
            <FontAwesomeIcon icon={faSignOut} />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <NavLink to="/dashboard/about" className={navItemClass}>
            <FontAwesomeIcon icon={faInfo} className="w-4 text-center" />
            <span>About us</span>
          </NavLink>
          <NavLink to="/dashboard/contact" className={navItemClass}>
            <FontAwesomeIcon icon={faPhone} className="w-4 text-center" />
            <span>Contact</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
