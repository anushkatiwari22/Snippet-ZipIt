import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
 

  const navigate = useNavigate();
  const handleSignUp = async (e) => {
     e.preventDefault();

  const userDetails = {
    username: e.target.username.value.toLowerCase(),
    email: e.target.email.value,
    password: e.target.password.value,
    confirmpassword: e.target.confirmpassword.value,
  };
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-6">
          <h1 className="text-slate-900 text-center text-2xl font-bold">
            Create an account
          </h1>

          <form className="space-y-6 mt-10" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="username"
                className="mb-2 text-slate-900 font-medium text-sm inline-block"
              >
                UserName
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="username"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
              />
            </div>

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
                required
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
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
              />
            </div>
            <div>
              <label
                htmlFor="confirmpassword"
                className="mb-2 text-slate-900 font-medium text-sm inline-block"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="••••••••"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
              />
            </div>

            <div className="flex items-start flex-wrap gap-2">
              <label className="flex items-center group has-[input:checked]:text-slate-900">
                <input
                  id="tmc"
                  name="tmc"
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
                  I accept the
                </span>
              </label>

              <a
                href="#"
                className="ml-1 text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Terms and Conditions
              </a>
            </div>

            <button
              onClick={() => {}}
              className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Create an account
            </button>
          </form>

          <div className="mt-6 text-slate-900 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
