import UserContext from "../utils/UserContext";
import { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faHouse,
  faInfo,
  faLightbulb,
  faMessage,
  faPhone,
  faRoad,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// Theme (same as the Lock page):
// ink #17171A · butter #FADF6B · bubblegum #F6A9CB · cream #FFF6E0

const baseItem =
  "flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17171A]";

const navItemClass = ({ isActive }) =>
  `${baseItem} ${
    isActive
      ? "bg-[#17171A] text-[#FADF6B]"
      : "text-[#17171A]/70 hover:bg-[#FADF6B]/60 hover:text-[#17171A]"
  }`;

const sectionLabel =
  "mb-1 px-4 text-[11px] font-semibold uppercase tracking-wide text-[#17171A]/45";

const Header = () => {
  const { obj, setObj } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await response.json();
    if (response.ok) {
      setObj(null);
      navigate("/login");
    }
  };

  return (
    <div className="font-display flex h-full flex-col border-r border-[#17171A]/10 bg-[#FFF6E0] p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
        <h1 className="text-lg font-bold tracking-tight text-[#17171A]">
          Solvi
        </h1>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h3 className={sectionLabel}>Main</h3>
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
          <h3 className={sectionLabel}>Account</h3>
          <NavLink to="/dashboard/profile" className={navItemClass}>
            <FontAwesomeIcon icon={faUser} className="w-4 text-center" />
            <span>Profile</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className={`${baseItem} text-[#17171A]/70 hover:bg-[#F6A9CB] hover:text-[#17171A] cursor-pointer`}
          >
            <FontAwesomeIcon icon={faSignOut} className="w-4 text-center" />
            <span>Logout</span>
          </button>
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