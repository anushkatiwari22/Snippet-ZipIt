const DashboardCards = () => {
  return (
    <div className="flex justify-between">
      <div className="border-2 p-4 rounded w-60">
        <h3 className="font-medium text-gray-700">Readiness</h3>
        <h1 className="text-4xl font-bold">60%</h1>
      </div>

      <div className="border-2 p-4 rounded w-60">
        <h3 className="font-medium text-gray-700">Streak</h3>
        <h1 className="text-4xl font-bold">3 days</h1>
      </div>

      <div className="border-2 p-4 rounded w-60">
        <h3 className="font-medium text-gray-700">Resume Score</h3>
        <h1 className="text-4xl font-bold">--</h1>
      </div>
    </div>
  );
};


export default DashboardCards ;