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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "Total NEOs",
            data: data.timeline_data.map((item) => item.total_count),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Hazardous NEOs",
            data: data.timeline_data.map((item) => item.hazardous_count),
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${days}-Day NEO Activity Timeline`,
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
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
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Number of NEOs",
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading timeline data...</p>
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
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Date Range:</strong> {data?.date_range.start} to{" "}
          {data?.date_range.end}
        </p>
        <p>
          <strong>Total Data Points:</strong> {data?.timeline_data.length} days
        </p>
      </div>
    </div>
  );
};

export default TimelineChart;
