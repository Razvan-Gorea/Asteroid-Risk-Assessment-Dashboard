import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { neoChartsService } from "../../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cardStyle = {
  background: "#0d1e38",
  border: "1px solid #1a3050",
  borderRadius: "2px",
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
};

const RiskLevelBarChart = ({ selectedDate = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = selectedDate
          ? await neoChartsService.getSizeDistributionByDate(selectedDate)
          : await neoChartsService.getSizeDistribution();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const chartData = data
    ? {
        labels: ["Minimal Risk", "Low Risk", "Moderate Risk", "High Risk"],
        datasets: [
          {
            label: "Number of NEOs",
            data: [
              data.size_distribution.find((item) => item.category.includes("Small"))?.count || 0,
              data.size_distribution.find((item) => item.category.includes("Medium"))?.count || 0,
              data.size_distribution.find((item) => item.category.includes("Large (1"))?.count || 0,
              data.size_distribution.find((item) => item.category.includes("Very Large"))?.count || 0,
            ],
            backgroundColor: [
              "rgba(0, 230, 118, 0.6)",
              "rgba(0, 176, 255, 0.6)",
              "rgba(255, 140, 0, 0.6)",
              "rgba(255, 23, 68, 0.65)",
            ],
            borderColor: ["rgba(0,230,118,1)", "rgba(0,176,255,1)", "rgba(255,140,0,1)", "rgba(255,23,68,1)"],
            borderWidth: 1.5,
            borderRadius: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Risk Level Distribution",
        color: "#c0d8f0",
        font: { family: "'Rajdhani', sans-serif", size: 14, weight: "bold" },
        padding: { bottom: 12 },
      },
      tooltip: {
        backgroundColor: "#0a1628",
        borderColor: "#1a3050",
        borderWidth: 1,
        titleColor: "#00d4ff",
        bodyColor: "#a0c0e0",
        callbacks: {
          label: (context) => {
            const riskMappings = [
              "Small asteroids (< 0.1 km) — Minimal atmospheric threat",
              "Medium asteroids (0.1–1 km) — Local damage potential",
              "Large asteroids (1–10 km) — Regional devastation risk",
              "Very large asteroids (>10 km) — Extinction level threat",
            ];
            return [`${context.parsed.y} NEOs`, riskMappings[context.dataIndex]];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Risk Level (by Estimated Max Diameter)", color: "#4a6280", font: { family: "'Barlow', sans-serif", size: 11 } },
        grid: { color: "rgba(0,212,255,0.04)" },
        ticks: { color: "#7090b0", font: { family: "'Barlow', sans-serif", size: 11 } },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of NEOs", color: "#4a6280", font: { family: "'Barlow', sans-serif", size: 11 } },
        grid: { color: "rgba(0,212,255,0.06)" },
        ticks: { color: "#7090b0", font: { family: "'Share Tech Mono', monospace", size: 11 } },
      },
    },
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: "2px", background: "linear-gradient(90deg, #00d4ff, transparent)", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
          <div className="scanner-line" style={{ position: "absolute", inset: 0, background: "rgba(0,212,255,0.6)", height: "100%" }} />
        </div>
        <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="section-label">Loading risk levels...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ color: "#ff4565", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Chart Error</div>
          <div style={{ color: "#4a6280", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem" }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ height: "300px" }}>
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
      <div style={{ marginTop: "0.75rem", borderTop: "1px solid #1a3050", paddingTop: "0.6rem", display: "flex", gap: "1.5rem" }}>
        <div>
          <div className="section-label">Total NEOs</div>
          <div className="font-mono-data" style={{ fontSize: "1rem", color: "#00d4ff" }}>{data?.total_neos}</div>
        </div>
        <div>
          <div className="section-label">Date</div>
          <div className="font-mono-data" style={{ fontSize: "0.8rem", color: "#7090b0" }}>{new Date(data?.date).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskLevelBarChart;
