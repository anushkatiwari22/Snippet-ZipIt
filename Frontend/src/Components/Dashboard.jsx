import { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Shimmer from "./Shimmer";
import axios from 'axios' ;

const Dashboard = () => {
  const { obj } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState();

useEffect(() => {
  const getDashboard = async () => {
    const response = await axios.post("http://localhost:3000/aidata", {
      userid: obj?.userid,
    });

    setDashboardData(response.data);
  };

  if (obj?.userid) {
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