import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { handleError, handleSuccess } from "../utils/popups";
import useVerfiyToken from "../utils/useVerifyToken"


const Login = () => {
  const navigate = useNavigate();
  const { obj, setObj } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // console.log("Login clicked");

    const enteredDetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    if(!enteredDetails.email || !enteredDetails.password){
      handleError("All fields are required");
      return;
    }

    try{
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredDetails),
      });

      const data = await response.json();
      
      if(data.success == "true") {
        const confirmationObj = await useVerfiyToken();
        setObj(confirmationObj);
        // handleSuccess(data?.message);
      } else {
        handleError(data?.message);
      }
      
      // setObj(data);

      // console.log("after setobj");
      
    }
    catch(error){
      console.error("LOGIN ERROR:", error);
      handleError(error);
    }
  }

  // useEffect(() => {
  //   console.log(obj);
  // },[obj])

  useEffect(() => {
    const handledashboard = async () => {
      const resp = await fetch("http://localhost:3000/checkanswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: obj?.userid,
        }),
      });

      const response = await resp.json();
      if(response.message=="true"){
        handleSuccess("Successfully logged in")
        navigate("/dashboard/home");
      }
      else{
        handleSuccess("Successfully logged in");
        navigate("/questions");
      }
    };

    if(obj?.userid){
      handledashboard();
    }
    
  },[obj?.userid]);


  return (
    <main className="bg-gray-50 px-4 md:px-8">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8">
            <h1 className="text-slate-900 text-center text-3xl font-bold">
              Log in
            </h1>

            <form className="space-y-6 mt-10" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@readymadeui.com"
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 text-slate-900 font-medium text-sm inline-block"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="flex items-start flex-wrap gap-2">
                <label className="flex items-center group has-[input:checked]:text-slate-900">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    required
                    className="sr-only"
                  />
                  {/* Custom box */}
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-slate-300 bg-white group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600"
                    aria-hidden="true"
                  >
                    {/* Checkmark */}
                    <svg
                      className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 5l3 3 7-7" />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm text-slate-700">
                    Remember me
                  </span>
                </label>

                <a
                  href="#"
                  className="ml-auto text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Sign in
              </button>

              <div className="text-slate-900 text-sm text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
