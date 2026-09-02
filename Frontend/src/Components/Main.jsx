import { Bell } from "lucide-react";
import SkillBar from './SkillBar'
import NextSteps from "./NextSteps";
import { Quote } from "lucide-react";
import DashboardCards from "./dashboardCards";
import { useContext } from "react";
import UserContext from "../utils/UserContext";

const Main = (props) => {

  const { obj } = useContext(UserContext);

  return (
    <div>
      <div className="flex justify-between  p-6">
        <div>
          <h1 className="text-2xl font-bold">Good AfterNoon {obj?.username}</h1>
          <h3>Backend Developer . Advanced </h3>
        </div>
        <div className="flex gap-10">
          <button>
            <Bell />
          </button>
        </div>
      </div>
      <div className="p-10">
        <DashboardCards/>
      </div>
      <div className="flex gap-10 ml-10 mr-10">
        <div className="w-3/5"><SkillBar/></div>
        <div className="w-2/5"> <NextSteps/> </div>
      </div>
      <div className=" flex flex-col gap-3 p-12">
        <div className="flex gap-3">
        <span> <Quote color="black" /></span>
        <span className="text-gray-800 text-xl tracking-tighter font-semibold">From your coach</span>
        </div>
        <p className=" text-2xl font-semibold tracking-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dolores doloribus mollitia! Similique, iste perferendis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis unde maior</p>
      </div>
    </div>
  );
};

export default Main;
