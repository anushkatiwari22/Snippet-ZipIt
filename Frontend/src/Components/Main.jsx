import { Bell } from "lucide-react";
import SkillBar from './SkillBar'
import NextSteps from "./NextSteps";
import { Quote } from "lucide-react";
import DashboardCards from "./dashboardCards";
import { useContext } from "react";
import UserContext from "../utils/UserContext";
import { useOutletContext } from "react-router-dom";

const Main = () => {

  const { obj } = useContext(UserContext);
  const dashboardData = useOutletContext();
  console.log(dashboardData);
  

  return (
    <div>
      hello
    </div>
  );
};

export default Main;
