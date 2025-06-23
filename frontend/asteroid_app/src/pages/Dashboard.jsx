import RiskAssessment from "../components/RiskAssessment";
import HighestRiskNeos from "../components/HighestRiskNeos";

function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <header className="bg-blue-500 text-white p-4 rounded-lg mb-6">
        <h1
          className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold 
                       leading-tight sm:leading-snug md:leading-normal"
        >
          Asteriod Risk Assessment Dashboard
        </h1>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-[1600px] mx-auto p-6">        
        <RiskAssessment />
        <HighestRiskNeos />
      </div>
    </div>
  );
}

export default Dashboard;
