import { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import axios from "axios";


const Dashboard = () => {
  const { obj } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState();

  useEffect(() => {
  if (!obj?.userid) return;

  const getDashboard = async () => {
    try {
      const response = await axios.post("http://localhost:3000/aidata", {
        userid: obj?.userid,
      });
      const data = response.data;
      setDashboardData(data);


      const lp = data?.review?.learningPlan;
      if (Array.isArray(lp) && lp.length > 4) { 
        const nextWeeks = lp.slice(4, 8);  
        const updated = await axios.post("http://localhost:3000/updatedashboard", {
          userid: obj?.userid,
          learningPlan: nextWeeks,
        });
        setDashboardData(updated.data);        
      }
    } catch (error) {
      console.error("getDashboard error:", error);
    }
  };

  if(obj?.userid != undefined) {
    getDashboard();
  }
}, [obj?.userid]);


  return (
    <div className="flex h-screen">
      <aside className="w-72 flex-shrink-0">
        <Header />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet context={dashboardData} />
      </main>
    </div>
  );
};

export default Dashboard;