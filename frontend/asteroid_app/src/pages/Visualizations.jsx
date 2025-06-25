import { useState, useEffect } from "react";
import { neoChartsService } from "../api/client";

// Component imports
import SizeDistributionChart from "../components/SizeDistributionChart";
import DistanceSizeScatterChart from "../components/DistanceSizeScatterChart";
import TimelineChart from "../components/TimelineChart";
import RiskLevelBarChart from "../components/RiskLevelBarChart";

const Visualizations = () => {
  const [selectedChart, setSelectedChart] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);

  // Get today's date for default
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch summary stats for the dashboard
    const fetchSummaryStats = async () => {
      try {
        const sizeData = await neoChartsService.getSizeDistribution();
        const scatterData = await neoChartsService.getDistanceSize();
        const timelineData = await neoChartsService.getTimeline(7);

        setSummaryStats({
          totalNeos: sizeData.total_neos,
          hazardousNeos: scatterData.scatter_data.filter(
            (neo) => neo.is_hazardous
          ).length,
          timelineDays: timelineData.timeline_data.length,
        });
      } catch (error) {
        console.error("Error fetching summary stats:", error);
      }
    };

    fetchSummaryStats();
  }, []);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate === today ? null : newDate);
  };

  const resetToToday = () => {
    setSelectedDate(null);
  };

  const chartFilterButtons = [
    { key: "all", label: "All Charts" },
    { key: "size", label: "Size Distribution" },
    { key: "scatter", label: "Distance vs Size" },
    { key: "timeline", label: "Timeline" },
    { key: "risk", label: "Risk Levels" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">
              NEO Data Visualizations
            </h1>

            {/* Date Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="text-sm text-blue-500">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Today's Data"}
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate || today}
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

          {/* Chart Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {chartFilterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedChart(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === key
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-blue-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Size Distribution Chart */}
          {(selectedChart === "all" || selectedChart === "size") && (
            <SizeDistributionChart selectedDate={selectedDate} />
          )}

          {/* Risk Level Distribution */}
          {(selectedChart === "all" || selectedChart === "risk") && (
            <RiskLevelBarChart selectedDate={selectedDate} />
          )}

          {/* Timeline Chart */}
          {(selectedChart === "all" || selectedChart === "timeline") && (
            <div className="lg:col-span-2">
              <TimelineChart days={7} />
            </div>
          )}

          {/* Distance vs Size Scatter Plot */}
          {(selectedChart === "all" || selectedChart === "scatter") && (
            <div className="lg:col-span-2">
              <DistanceSizeScatterChart selectedDate={selectedDate} />
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Key Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {summaryStats.totalNeos}
                </p>
                <p className="text-gray-600">Total NEOs Today</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {summaryStats.hazardousNeos}
                </p>
                <p className="text-gray-600">Potentially Hazardous</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {summaryStats.timelineDays}
                </p>
                <p className="text-gray-600">Days of Data</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizations;
