const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="border-2 p-4 rounded">
        <h3 className="font-medium text-gray-700">Readiness</h3>
        <h1 className="text-4xl font-bold">60%</h1>
      </div>

      <div className="border-2 p-4 rounded">
        <h3 className="font-medium text-gray-700">Streak</h3>
        <h1 className="text-4xl font-bold">3 days</h1>
      </div>

      <div className="border-2 p-4 rounded">
        <h3 className="font-medium text-gray-700">Resume Score</h3>
        <h1 className="text-4xl font-bold">--</h1>
      </div>
    </div>
  );
};

export default DashboardCards;