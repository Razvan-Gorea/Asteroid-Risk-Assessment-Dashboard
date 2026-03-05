import { useState, useEffect } from "react";
import { neoChartsService } from "../api/client";

import SizeDistributionChart from "../components/VisualizationComponents/SizeDistributionChart";
import DistanceSizeScatterChart from "../components/VisualizationComponents/DistanceSizeScatterChart";
import TimelineChart from "../components/VisualizationComponents/TimelineChart";
import RiskLevelBarChart from "../components/VisualizationComponents/RiskLevelBarChart";

const chartFilterButtons = [
  { key: "all",      label: "All Charts" },
  { key: "size",     label: "Size Dist." },
  { key: "scatter",  label: "Distance vs Size" },
  { key: "timeline", label: "Timeline" },
  { key: "risk",     label: "Risk Levels" },
];

const Visualizations = () => {
  const [selectedChart, setSelectedChart] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [showKeyInsights, setShowKeyInsights] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSummaryStats = async () => {
      try {
        const sizeData = await neoChartsService.getSizeDistribution();
        const scatterData = await neoChartsService.getDistanceSize();
        const timelineData = await neoChartsService.getTimeline(7);
        setSummaryStats({
          totalNeos: sizeData.total_neos,
          hazardousNeos: scatterData.scatter_data.filter((neo) => neo.is_hazardous).length,
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

  const resetToToday = () => setSelectedDate(null);

  return (
    <div style={{ minHeight: "100vh", padding: "0 0.25rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            className="neo-card"
            style={{ padding: "1rem 1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
          >
            <div>
              <div className="section-label" style={{ marginBottom: "0.25rem" }}>Orbital Surveillance</div>
              <h1 className="font-display" style={{ fontSize: "1.3rem", color: "#e0f0ff", margin: 0, fontWeight: 700 }}>
                NEO Data Visualizations
              </h1>
            </div>

            {/* Date Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span className="font-mono-data" style={{ fontSize: "0.7rem", color: "#4a6280" }}>
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
                  : "Live — Today's Data"}
              </span>
              <input
                type="date"
                value={selectedDate || today}
                onChange={handleDateChange}
                className="neo-input"
                style={{ fontSize: "0.75rem" }}
              />
              <button className="btn-ghost" onClick={resetToToday}>Today</button>
            </div>
          </div>
        </div>

        {/* Chart Filter Pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {chartFilterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedChart(key)}
              className="font-display"
              style={{
                padding: "0.35rem 0.9rem",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                borderRadius: "1px",
                border: selectedChart === key ? "1px solid rgba(0,212,255,0.5)" : "1px solid #1a3050",
                background: selectedChart === key ? "rgba(0,212,255,0.1)" : "transparent",
                color: selectedChart === key ? "#00d4ff" : "#4a6280",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "1rem" }}>
          {(selectedChart === "all" || selectedChart === "size") && (
            <SizeDistributionChart selectedDate={selectedDate} />
          )}
          {(selectedChart === "all" || selectedChart === "risk") && (
            <RiskLevelBarChart selectedDate={selectedDate} />
          )}
          {(selectedChart === "all" || selectedChart === "timeline") && (
            <div style={{ gridColumn: "1 / -1" }}>
              <TimelineChart days={7} />
            </div>
          )}
          {(selectedChart === "all" || selectedChart === "scatter") && (
            <div style={{ gridColumn: "1 / -1" }}>
              <DistanceSizeScatterChart selectedDate={selectedDate} />
            </div>
          )}
        </div>

        {/* Key Insights */}
        {summaryStats && (
          <div className="neo-card" style={{ marginTop: "1.25rem" }}>
            <div
              onClick={() => setShowKeyInsights(!showKeyInsights)}
              style={{
                padding: "0.9rem 1.25rem",
                borderBottom: showKeyInsights ? "1px solid #1a3050" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="font-display" style={{ fontSize: "0.85rem", color: "#e0f0ff", letterSpacing: "0.1em" }}>
                Key Insights
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="section-label">{showKeyInsights ? "Hide" : "Show"}</span>
                <svg
                  style={{ width: "14px", height: "14px", color: "#4a6280", transform: showKeyInsights ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div
              style={{
                maxHeight: showKeyInsights ? "200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
                {[
                  { label: "Total NEOs Today", value: summaryStats.totalNeos, accent: "#00d4ff" },
                  { label: "Potentially Hazardous", value: summaryStats.hazardousNeos, accent: "#ff4565" },
                  { label: "Days of Data", value: summaryStats.timelineDays, accent: "#00e676" },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="stat-card bracket" style={{ textAlign: "center" }}>
                    <div className="font-mono-data" style={{ fontSize: "2rem", color: accent, lineHeight: 1 }}>{value}</div>
                    <div className="section-label" style={{ marginTop: "0.4rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizations;
