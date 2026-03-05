import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { neoChartsService } from "../../api/client";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const cardStyle = {
  background: "#0d1e38",
  border: "1px solid #1a3050",
  borderRadius: "2px",
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
};

const TimelineChart = ({ days = 7 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await neoChartsService.getTimeline(days);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [days]);

  const chartData = data
    ? {
        labels: data.timeline_data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        ),
        datasets: [
          {
            label: "Total NEOs",
            data: data.timeline_data.map((item) => item.total_count),
            borderColor: "rgba(0, 212, 255, 0.9)",
            backgroundColor: "rgba(0, 212, 255, 0.06)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgba(0, 212, 255, 0.8)",
            pointBorderColor: "#0d1e38",
            pointBorderWidth: 2,
            pointRadius: 4,
          },
          {
            label: "Hazardous NEOs",
            data: data.timeline_data.map((item) => item.hazardous_count),
            borderColor: "rgba(255, 23, 68, 0.9)",
            backgroundColor: "rgba(255, 23, 68, 0.06)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgba(255, 23, 68, 0.8)",
            pointBorderColor: "#0d1e38",
            pointBorderWidth: 2,
            pointRadius: 4,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#7090b0", usePointStyle: true, font: { family: "'Barlow', sans-serif", size: 11 } },
      },
      title: {
        display: true,
        text: `${days}-Day NEO Activity Timeline`,
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
          afterLabel: (context) => {
            if (context.datasetIndex === 0) {
              const item = data?.timeline_data[context.dataIndex];
              return [
                `Closest: ${(item?.closest_distance / 1000000).toFixed(2)}M km`,
                `Largest: ${item?.largest_diameter.toFixed(3)} km`,
              ];
            }
            return null;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date", color: "#4a6280", font: { family: "'Barlow', sans-serif", size: 11 } },
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
          <span className="section-label">Loading timeline data...</span>
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
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
      <div style={{ marginTop: "0.75rem", borderTop: "1px solid #1a3050", paddingTop: "0.6rem", display: "flex", gap: "1.5rem" }}>
        <div>
          <div className="section-label">Date Range</div>
          <div className="font-mono-data" style={{ fontSize: "0.8rem", color: "#7090b0" }}>{data?.date_range.start} → {data?.date_range.end}</div>
        </div>
        <div>
          <div className="section-label">Data Points</div>
          <div className="font-mono-data" style={{ fontSize: "1rem", color: "#00d4ff" }}>{data?.timeline_data.length} days</div>
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;
