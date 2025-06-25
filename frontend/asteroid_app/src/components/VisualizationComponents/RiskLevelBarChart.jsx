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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RiskLevelBarChart = ({ selectedDate = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using size distribution as a proxy for risk levels
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

  // Map size categories to risk levels
  const chartData = data
    ? {
        labels: ["Minimal Risk", "Low Risk", "Moderate Risk", "High Risk"],
        datasets: [
          {
            label: "Number of NEOs",
            data: [
              data.size_distribution.find((item) =>
                item.category.includes("Small")
              )?.count || 0, // Small = Minimal
              data.size_distribution.find((item) =>
                item.category.includes("Medium")
              )?.count || 0, // Medium = Low
              data.size_distribution.find((item) =>
                item.category.includes("Large (1")
              )?.count || 0, // Large = Moderate
              data.size_distribution.find((item) =>
                item.category.includes("Very Large")
              )?.count || 0, // Very Large = High
            ],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)", // Green - Minimal
              "rgba(251, 191, 36, 0.8)", // Yellow - Low
              "rgba(249, 115, 22, 0.8)", // Orange - Moderate
              "rgba(239, 68, 68, 0.8)", // Red - High
            ],
            borderColor: [
              "rgb(34, 197, 94)",
              "rgb(251, 191, 36)",
              "rgb(249, 115, 22)",
              "rgb(239, 68, 68)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Risk Level Distribution",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const riskMappings = [
              "Small asteroids (< 0.1 km) - Minimal atmospheric threat",
              "Medium asteroids (0.1-1 km) - Local damage potential",
              "Large asteroids (1-10 km) - Regional devastation risk",
              "Very large asteroids (>10 km) - Extinction level threat",
            ];
            return [
              `${context.parsed.y} NEOs`,
              riskMappings[context.dataIndex],
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Risk Level (Based on Size)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of NEOs",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading risk levels...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
      <div className="h-80">
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Total NEOs:</strong> {data?.total_neos}
        </p>
        <p>
          <strong>Date:</strong> {new Date(data?.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default RiskLevelBarChart;
