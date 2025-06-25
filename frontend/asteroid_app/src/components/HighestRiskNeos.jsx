import { useState, useEffect } from "react";
import { neoRiskService } from "../api/client";

const HighestRiskNeos = ({ selectedDate = null, limit = 10 }) => {
  // Get today's date once
  const today = new Date().toISOString().split("T")[0];

  // Initialize state with proper fallback
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate || today;
  });
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchHighestRiskNeos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await neoRiskService.getHighestRiskNeos(
        currentDate,
        currentDate,
        limit
      );

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

  // Effects
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (currentDate) {
      fetchHighestRiskNeos();
    }
  }, [currentDate, limit]);

  useEffect(() => {
    setShowAll(false);
  }, [currentDate]);

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

  const getRiskBgColor = (riskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-50 border-red-200";
      case "HIGH":
        return "bg-orange-50 border-orange-200";
      case "MODERATE":
        return "bg-yellow-50 border-yellow-200";
      case "LOW":
        return "bg-blue-50 border-blue-200";
      case "MINIMAL":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="bg-white rounded-lg shadow border border-blue-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
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
                Error loading highest risk data
              </h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button
                onClick={fetchHighestRiskNeos}
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
    !riskData.highest_risk_neos ||
    riskData.highest_risk_neos.length === 0
  ) {
    return (
      <div className="w-full p-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No highest risk NEO data available for {currentDate}
          </p>
          <button
            onClick={fetchHighestRiskNeos}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { highest_risk_neos } = riskData;

  // Calculate display variables
  const hasMoreThanFive = highest_risk_neos.length > 5;
  const displayNeos = showAll
    ? highest_risk_neos
    : highest_risk_neos.slice(0, 5);

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-lg shadow border border-blue-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-blue-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              {currentDate === today ? "Today's" : ""} Highest Risk NEOs
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="text-xs text-blue-500">
                {new Date(currentDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex gap-1">
                <input
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                  className="px-2 py-1 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={resetToToday}
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 py-2 bg-gray-50 border-b border-blue-200">
          <p className="text-xs text-gray-600">
            Showing {displayNeos.length} of {highest_risk_neos.length} highest
            risk asteroids
          </p>
        </div>

        {/* NEOs List */}
        <div className="p-4">
          <div className="space-y-3">
            {displayNeos.map((neo, index) => (
              <div
                key={neo.id}
                className={`p-3 rounded border ${getRiskBgColor(
                  neo.risk_level
                )}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                    {neo.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRiskColorClass(
                      neo.risk_level
                    )}`}
                  >
                    {neo.risk_level}
                  </span>
                </div>

                {/* Compact metrics */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <h4 className="text-blue-500 text-xs font-medium">Risk Score</h4>
                    <p className="text-gray-900 text-sm font-bold">
                      {neo.risk_score}/100
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <h4 className="text-blue-500 text-xs font-medium">
                      Size (Diameter)
                    </h4>
                    <p className="text-gray-900 text-sm font-bold">
                      {neo.size_km.toFixed(2)} km
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <h4 className="text-blue-500 text-xs font-medium">
                      Distance (Lunar Distance)
                    </h4>
                    <p className="text-gray-900 text-sm font-bold">
                      {neo.miss_distance_lunar} LD
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <h4 className="text-blue-500 text-xs font-medium">
                      Velocity
                    </h4>
                    <p className="text-gray-900 text-sm font-bold">
                      {(neo.velocity_kmh / 1000).toFixed(0)}k km/h
                    </p>
                  </div>
                </div>

                {/* NASA Hazardous warning */}
                {neo.is_nasa_hazardous && (
                  <div className="flex items-center mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <svg
                      className="h-3 w-3 text-red-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium text-red-700">
                      NASA Hazardous
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Show Less Button */}
          {hasMoreThanFive && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showAll
                  ? `Show Less`
                  : `Show More (${highest_risk_neos.length - 5} more)`}
              </button>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="px-4 py-2 border-t border-blue-200">
          <button
            onClick={fetchHighestRiskNeos}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighestRiskNeos;
