import { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { obj } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState();

  useEffect(() => {
    const getDashboard = async () => {
      const response = await fetch("http://localhost:3000/aidata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: obj?.userid,
        }),
      });

      if (response.ok) {
        const data = await response.json(response);
        setDashboardData(data);
      }
    };

    if (obj?.userid) {
      getDashboard();
    }
  }, [obj?.userid]);

  useEffect(() => {
    console.log(dashboardData);
    
  },[dashboardData])


  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:block w-64 flex-shrink-0 border-r">
        <Header />
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
