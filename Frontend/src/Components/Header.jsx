import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faHouse,
  faInfo,
  faLightbulb,
  faMessage,
  faPhone,
  faRoad,
  faTableCellsLarge,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium tracking-normal transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  }`;

const Header = () => {
  return (
    <div className="font-display w-64 h-screen flex flex-col bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8 px-1">
        <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">Solvi</h1>
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