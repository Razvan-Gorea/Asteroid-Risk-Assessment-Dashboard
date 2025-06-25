// Component imports
import RiskAssessment from "../components/RiskComponents/RiskAssessment";
import HighestRiskNeos from "../components/RiskComponents/HighestRiskNeos";

function Dashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-8xl mx-auto p-6">
      <RiskAssessment />
      <HighestRiskNeos />
    </div>
  );
}

export default Dashboard;
