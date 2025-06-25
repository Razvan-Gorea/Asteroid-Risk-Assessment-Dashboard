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
              .map((item) => ({
                x: item.x / 1000000,
                y: item.y,
                name: item.name,
              })),
            backgroundColor: "rgba(34, 197, 94, 0.6)",
            borderColor: "rgb(34, 197, 94)",
            pointRadius: 6,
          },
          {
            label: "Potentially Hazardous NEOs",
            data: data.scatter_data
              .filter((item) => item.is_hazardous)
              .map((item) => ({
                x: item.x / 1000000,
                y: item.y,
                name: item.name,
              })),
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgb(239, 68, 68)",
            pointRadius: 8,
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
      },
      title: {
        display: true,
        text: "NEO Distance vs Size Analysis",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
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
        display: true,
        title: {
          display: true,
          text: "Distance from Earth (Million km)",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Estimated Max Diameter (km)",
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
            <p className="text-gray-600 text-sm">Loading scatter plot...</p>
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
        {chartData && <Scatter data={chartData} options={chartOptions} />}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Analysis:</strong> Shows relationship between NEO distance and
          size
        </p>
        <p>
          <strong>Date:</strong> {new Date(data?.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default DistanceSizeScatterChart;
