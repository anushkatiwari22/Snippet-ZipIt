const useVerfiyToken = async () => {
  const response = await fetch("http://localhost:3000/verifyuser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  return data;
};

export default useVerfiyToken;
