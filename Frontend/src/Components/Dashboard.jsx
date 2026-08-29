import { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import Header  from "./Header"
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { obj } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState();

  console.log(obj?.userid);
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
        const data = await response.json();
        setDashboardData(data);
      }
    };

    if (obj?.userid) {
      getDashboard();
    }
  }, [obj?.userid]);


  return (
    <div className="flex w-full h-screen overflow-hidden">

      <div className="w-[17%] h-full  flex-shrink-0">
        <Header />   
      </div>
      <div className ="w-[83%] h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )

};

export default Dashboard;
