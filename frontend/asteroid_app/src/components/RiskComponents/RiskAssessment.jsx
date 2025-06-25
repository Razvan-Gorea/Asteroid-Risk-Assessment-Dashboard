import { useState, useEffect } from "react";
import { neoRiskService } from "../../api/client";

const RiskAssessment = ({ selectedDate = null }) => {
  // Get today's date once
  const today = new Date().toISOString().split("T")[0];

  // Initialize state with proper fallback
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate || today;
  });
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiskAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use today's endpoint by default, date-specific endpoint when user selects a date
      const data =
        currentDate === today
          ? await neoRiskService.getRiskAssessment() // No date parameter for today
          : await neoRiskService.getRiskAssessmentByDate(currentDate); // Pass date when user selects

      setRiskData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setCurrentDate(event.target.value);
  };

  const resetToToday = () => {
    setCurrentDate(today);
  };

  useEffect(() => {
    // Update currentDate when selectedDate prop changes
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (currentDate) {
      fetchRiskAssessment();
    }
  }, [currentDate]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading risk data
              </h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button
                onClick={fetchRiskAssessment}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    !riskData ||
    !riskData.risk_assessments ||
    riskData.risk_assessments.length === 0
  ) {
    return (
      <div className="w-full max-w-5xl p-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No risk assessment data available for {currentDate}
          </p>
          <button
            onClick={fetchRiskAssessment}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { risk_summary, risk_assessments, date } = riskData;
  const highestRiskNEO =
    risk_assessments && risk_assessments.length > 0
      ? risk_assessments[0]
      : null;

  const getRiskColorClass = (riskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MODERATE":
        return "bg-yellow-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      case "MINIMAL":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="w-full max-w-5xl p-4">
      <div className="bg-white rounded-lg shadow border border-blue-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
              {currentDate === new Date().toISOString().split("T")[0]
                ? "Today's"
                : ""}{" "}
              Risk Assessment
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="text-sm text-blue-500">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  className="px-3 py-1 text-sm border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={resetToToday}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Summary Stats */}
        <div className="p-6 border-b border-blue-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium">Total NEOs</h3>
              <p className="text-gray-900 text-2xl font-bold mt-2">
                {risk_summary.total_objects}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium">Critical</h3>
              <p className="text-gray-900 text-2xl font-bold mt-2">
                {risk_summary.critical_risk}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium">High</h3>
              <p className="text-gray-900 text-2xl font-bold mt-2">
                {risk_summary.high_risk}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium">Moderate</h3>
              <p className="text-gray-900 text-2xl font-bold mt-2">
                {risk_summary.moderate_risk}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center col-span-2 sm:col-span-1">
              <h3 className="text-blue-500 text-sm font-medium">Low/Minimal</h3>
              <p className="text-gray-900 text-2xl font-bold mt-2">
                {risk_summary.low_risk + risk_summary.minimal_risk}
              </p>
            </div>
          </div>
        </div>

        {/* Highest Risk NEO */}
        {highestRiskNEO && (
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                    Highest Risk Object
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColorClass(
                      highestRiskNEO.risk_level
                    )}`}
                  >
                    {highestRiskNEO.risk_level}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-lg mb-1">
                      {highestRiskNEO.name}
                    </h4>
                    <p className="text-sm text-blue-500">
                      {highestRiskNEO.risk_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                      <h3 className="text-blue-500 text-sm font-medium">
                        Risk Score
                      </h3>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        {highestRiskNEO.risk_score}/100
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                      <h3 className="text-blue-500 text-sm font-medium">
                        Size (Diameter)
                      </h3>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        {highestRiskNEO.size_km.toFixed(3)} km
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                      <h3 className="text-blue-500 text-sm font-medium">
                        Distance (Lunar)
                      </h3>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        {highestRiskNEO.miss_distance_lunar} LD
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                      <h3 className="text-blue-500 text-sm font-medium">
                        Velocity
                      </h3>
                      <p className="text-gray-900 text-xl font-bold mt-2">
                        {(highestRiskNEO.velocity_kmh / 1000).toFixed(0)}k km/h
                      </p>
                    </div>
                  </div>

                  {highestRiskNEO.is_nasa_hazardous && (
                    <div className="flex items-center p-3 bg-white rounded-lg shadow border border-blue-200">
                      <svg
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-500">
                        NASA Classified as Potentially Hazardous
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="px-6 py-3 border-t border-blue-200">
          <button
            onClick={fetchRiskAssessment}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
