import { Bell } from "lucide-react";
import SkillBar from './SkillBar'
import NextSteps from "./NextSteps";
import { Quote } from "lucide-react";

const Main = () => {
  return (
    <div>
      <div className="flex justify-between  p-6">
        <div>
          <h1 className="text-2xl font-bold">Good AfterNoon Rahul</h1>
          <h3>Backend Developer . Advanced </h3>
        </div>
        <div className="flex gap-10">
          <button>
            <Bell />
          </button>
          <button className="rounded-full pr-5 pl-5 bg-blue-400">R</button>
        </div>
      </div>
      <div className="flex gap-90 p-10 pl-30 ">
        <div className="flex flex-col justify-center border-b-gray-900 border-2 p-3 h-25 w-60 pb-7  rounded ">
          <h3 className="font-medium text-gray-700 tracking-tighter">
            Readiness
          </h3>
          <h1 className="text-4xl font-bold">60%</h1>
        </div>
        <div className="flex flex-col justify-center border-b-gray-900 border-2 p-3 h-25 w-60 pb-7 rounded ">
          <h3 className="font-medium text-gray-700 tracking-tighter">Streak</h3>
          <h1 className="text-4xl font-bold">3 days</h1>
        </div>
        <div className="flex flex-col justify-center border-b-gray-900 border-2 p-3 h-25 w-60 pb-7 rounded ">
          <h3 className="font-medium text-gray-700 tracking-tighter">
            Resume Score
          </h3>
          <h1 className="text-4xl font-bold">--</h1>
        </div>
      </div>
      <div className="flex gap-10 ml-10 mr-10">
        <div className="w-3/5"><SkillBar/></div>
        <div className="w-2/5"> <NextSteps/> </div>
      </div>
      <div className=" flex flex-col gap-3 p-12">
        <div className="flex gap-3">
        <span> <Quote color="black" /></span>
        <span className="text-gray-800 text-xl tracking-tighter font-semibold">From your coach</span>
        </div>
        <p className=" text-2xl font-semibold tracking-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dolores doloribus mollitia! Similique, iste perferendis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis unde maior</p>
      </div>
    </div>
  );
};

export default Main;
