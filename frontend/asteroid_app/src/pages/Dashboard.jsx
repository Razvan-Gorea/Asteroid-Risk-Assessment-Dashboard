import RiskAssessment from "../components/RiskAssessment";
import HighestRiskNeos from "../components/HighestRiskNeos";

function Dashboard() {
  return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-[1600px] mx-auto p-6">
        <RiskAssessment />
        <HighestRiskNeos />
      </div>
  );
}

export default Dashboard;
