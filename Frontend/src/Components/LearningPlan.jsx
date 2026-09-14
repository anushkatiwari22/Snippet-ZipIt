import { useOutletContext } from "react-router-dom";

const LearningPlan = () => {

  const dashboardData = useOutletContext();

    return (
        <>
      <div className="pt-4">
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#1C1B2E] pl-3.5">
          Learning Plan
        </h1>
        <div>
          <h4>{dashboardData?.review?.learningPlan[0]?.week}</h4>
        </div>
      </div>
    </>
    )
} 
export default LearningPlan;