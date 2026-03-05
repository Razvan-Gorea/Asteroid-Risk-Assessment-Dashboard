import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { neoChartsService } from "../../api/client";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const cardStyle = {
  background: "#0d1e38",
  border: "1px solid #1a3050",
  borderRadius: "2px",
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
};

const SizeDistributionChart = ({ selectedDate = null }) => {
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
        labels: data.size_distribution.map((item) => item.category),
        datasets: [
          {
            data: data.size_distribution.map((item) => item.count),
            backgroundColor: [
              "rgba(0, 230, 118, 0.65)",
              "rgba(0, 176, 255, 0.65)",
              "rgba(255, 140, 0, 0.65)",
              "rgba(255, 23, 68, 0.7)",
            ],
            borderColor: ["rgba(0,230,118,1)", "rgba(0,176,255,1)", "rgba(255,140,0,1)", "rgba(255,23,68,1)"],
            borderWidth: 1.5,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 16, usePointStyle: true, color: "#7090b0", font: { family: "'Barlow', sans-serif", size: 11 } },
      },
      title: {
        display: true,
        text: "NEO Size Distribution",
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
            const item = data?.size_distribution[context.dataIndex];
            return [`${context.label}: ${context.parsed} NEOs (${item?.percentage}%)`, `Based on estimated max diameter`];
          },
        },
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
          <span className="section-label">Loading size distribution...</span>
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
        {chartData && <Pie data={chartData} options={chartOptions} />}
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

export default SizeDistributionChart;
