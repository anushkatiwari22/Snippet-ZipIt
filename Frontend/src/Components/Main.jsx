import { Bell, Quote } from "lucide-react";
import SkillBar from "./SkillBar";
import NextSteps from "./NextSteps";
import DashboardCards from "./dashboardCards";
import { useContext } from "react";
import UserContext from "../utils/UserContext";

const Main = () => {
  
  
  const { obj } = useContext(UserContext);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">Good AfterNoon {obj?.username}</h1>
          <h3>Backend Developer . Advanced </h3>
        </div>

        <button>
          <Bell />
        </button>
      </div>

      {/* Cards */}
      <div className="p-4 md:p-10">
        <DashboardCards />
      </div>

      {/* Skills + Next Steps */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-10">
        <div className="w-full lg:w-3/5">
          <SkillBar  />
        </div>

        <div className="w-full lg:w-2/5">
          <NextSteps />
        </div>
      </div>

      {/* Coach Section */}
      <div className="flex flex-col gap-3 p-4 md:p-12">
        <div className="flex items-center gap-3">
          <Quote />
          <span className="text-gray-800 text-lg md:text-xl font-semibold">
            From your coach
          </span>
        </div>

        <p className="text-lg md:text-2xl font-semibold tracking-tight">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dolores
          doloribus mollitia! Similique, iste perferendis?
        </p>
      </div>
    </div>
  );
};

export default Main;