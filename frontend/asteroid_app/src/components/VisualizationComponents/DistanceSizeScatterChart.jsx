import { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { neoChartsService } from "../../api/client";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

const cardStyle = {
  background: "#0d1e38",
  border: "1px solid #1a3050",
  borderRadius: "2px",
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
};

const DistanceSizeScatterChart = ({ selectedDate = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = selectedDate
          ? await neoChartsService.getDistanceSizeByDate(selectedDate)
          : await neoChartsService.getDistanceSize();
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
        datasets: [
          {
            label: "Non-Hazardous NEOs",
            data: data.scatter_data
              .filter((item) => !item.is_hazardous)
              .map((item) => ({ x: item.x / 1000000, y: item.y, name: item.name })),
            backgroundColor: "rgba(0, 212, 255, 0.55)",
            borderColor: "rgba(0, 212, 255, 0.9)",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Potentially Hazardous NEOs",
            data: data.scatter_data
              .filter((item) => item.is_hazardous)
              .map((item) => ({ x: item.x / 1000000, y: item.y, name: item.name })),
            backgroundColor: "rgba(255, 23, 68, 0.7)",
            borderColor: "rgba(255, 23, 68, 1)",
            pointRadius: 7,
            pointHoverRadius: 9,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#7090b0", usePointStyle: true, font: { family: "'Barlow', sans-serif", size: 11 } },
      },
      title: {
        display: true,
        text: "NEO Distance vs Size Analysis",
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
          title: (context) => context[0].raw.name || "NEO",
          label: (context) => [
            `Distance: ${context.parsed.x.toFixed(2)} million km`,
            `Diameter: ${context.parsed.y.toFixed(3)} km`,
            `Type: ${context.dataset.label}`,
          ],
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Distance from Earth (Million km)", color: "#4a6280", font: { family: "'Barlow', sans-serif", size: 11 } },
        grid: { color: "rgba(0,212,255,0.04)" },
        ticks: { color: "#7090b0", font: { family: "'Share Tech Mono', monospace", size: 10 } },
      },
      y: {
        title: { display: true, text: "Estimated Max Diameter (km)", color: "#4a6280", font: { family: "'Barlow', sans-serif", size: 11 } },
        grid: { color: "rgba(0,212,255,0.06)" },
        ticks: { color: "#7090b0", font: { family: "'Share Tech Mono', monospace", size: 10 } },
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
          <span className="section-label">Loading scatter plot...</span>
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
        {chartData && <Scatter data={chartData} options={chartOptions} />}
      </div>
      <div style={{ marginTop: "0.75rem", borderTop: "1px solid #1a3050", paddingTop: "0.6rem", display: "flex", gap: "1.5rem" }}>
        <div>
          <div className="section-label">Analysis</div>
          <div style={{ fontSize: "0.75rem", color: "#4a6280", fontFamily: "'Barlow', sans-serif" }}>Distance vs size relationship</div>
        </div>
        <div>
          <div className="section-label">Date</div>
          <div className="font-mono-data" style={{ fontSize: "0.8rem", color: "#7090b0" }}>{new Date(data?.date).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default DistanceSizeScatterChart;
