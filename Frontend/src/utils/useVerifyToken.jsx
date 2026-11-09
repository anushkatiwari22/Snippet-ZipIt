import axios from "axios";
const useVerfiyToken = async () => {

  const response = await axios.get("http://localhost:3000/verifyuser",{withCredentials: true})

  return response?.data;
};

export default useVerfiyToken;
