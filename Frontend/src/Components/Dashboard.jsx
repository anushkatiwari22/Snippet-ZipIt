import { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import Main from "./Main";

const Dashboard = () => {
  const { obj } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState();

  // console.log(obj);
  //console.log("USER ID:", obj?.userid);
  // console.log(typeof(obj.userid));
  //console.log(JSON.stringify(obj.userid));
  // console.log(obj.userid);
  // const user = {
  //     id : obj.userid
  // }

  console.log(obj.userid);
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
        // console.log(data);
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
    <Main/>
  );
};

export default Dashboard;
