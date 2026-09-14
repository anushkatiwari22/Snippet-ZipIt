const Main = () => {
<<<<<<< HEAD
  return(
    <div>hello</div>
  )
}
=======

  const { obj } = useContext(UserContext);
  const dashboardData = useOutletContext();
  console.log(dashboardData);
  

  return (
    <div>
      <div className="flex justify-between  p-6">
        <div>
          <h1 className="text-2xl font-bold">Good AfterNoon, {obj?.username}</h1>
          <h3>Future {dashboardData?.review?.careerProfile?.targetRole} , {dashboardData?.review?.careerProfile?.experienceLevel} </h3>
          <div>
            <div className=""></div>
          </div>
        </div>
        <div className="flex gap-10">
          <button>
            <Bell />
          </button>
        </div>
      </div>
      <div className="p-10">
        <DashboardCards/>
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
>>>>>>> 1acdff1326c8c57719b596f088921b07457465ce

export default Main;
