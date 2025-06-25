import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

import { neoChartsService } from "../../api/client";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

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
              "#10B981", // Green for small
              "#F59E0B", // Yellow for medium
              "#EF4444", // Red for large
              "#7C2D12", // Dark red for very large
            ],
            borderColor: ["#059669", "#D97706", "#DC2626", "#651E0E"],
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
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "NEO Size Distribution",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = data?.size_distribution[context.dataIndex];
            return `${context.label}: ${context.parsed} NEOs (${item?.percentage}%)`;
          },
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
            <p className="text-gray-600 text-sm">
              Loading size distribution...
            </p>
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
        {chartData && <Pie data={chartData} options={chartOptions} />}
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

export default SizeDistributionChart;
