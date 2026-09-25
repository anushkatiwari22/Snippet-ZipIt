import axios from "axios";
const useVerfiyToken = async () => {
  // const response = await fetch("http://localhost:3000/verifyuser", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include",
  // });

  const response = await axios.get("http://localhost:3000/verifyuser",{withCredentials: true})

  // const data = await response.json();
  // console.log(response);
  return response?.data;
};

export default useVerfiyToken;
