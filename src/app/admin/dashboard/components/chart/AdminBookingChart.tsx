"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";

export type FilterKey = "1d" | "7d" | "30d" | "month";

interface FilterChartProps {
  title: string;
  initialFilter?: FilterKey;
}

// du lieu render
const dataSets: Record<
  FilterKey,
  { series1: number[]; series2: number[]; categories: string[] }
> = {
  "1d": {
    series1: [31, 40, 28, 51],
    series2: [11, 32, 45, 32],
    categories: [
      "2025-11-10T00:00:00.000Z",
      "2025-11-10T06:00:00.000Z",
      "2025-11-10T12:00:00.000Z",
      "2025-11-10T18:00:00.000Z",
    ],
  },
  "7d": {
    series1: [31, 40, 28, 51, 42, 109, 100],
    series2: [11, 32, 45, 32, 34, 52, 41],
    categories: [
      "2025-11-04T00:00:00.000Z",
      "2025-11-05T00:00:00.000Z",
      "2025-11-06T00:00:00.000Z",
      "2025-11-07T00:00:00.000Z",
      "2025-11-08T00:00:00.000Z",
      "2025-11-09T00:00:00.000Z",
      "2025-11-10T00:00:00.000Z",
    ],
  },
  "30d": {
    series1: [10, 20, 15, 30, 25, 35, 45, 40, 60, 50, 70, 80],
    series2: [5, 10, 8, 20, 15, 25, 30, 28, 40, 35, 45, 50],
    categories: Array.from(
      { length: 12 },
      (_, i) => `2025-10-${i + 1}T00:00:00.000Z`
    ),
  },
  month: {
    series1: [120, 150, 180, 200, 170, 210, 250, 230, 260, 300, 280, 320],
    series2: [100, 120, 160, 180, 150, 190, 220, 210, 230, 270, 250, 290],
    categories: [
      "2025-01-01T00:00:00.000Z",
      "2025-02-01T00:00:00.000Z",
      "2025-03-01T00:00:00.000Z",
      "2025-04-01T00:00:00.000Z",
      "2025-05-01T00:00:00.000Z",
      "2025-06-01T00:00:00.000Z",
      "2025-07-01T00:00:00.000Z",
      "2025-08-01T00:00:00.000Z",
      "2025-09-01T00:00:00.000Z",
      "2025-10-01T00:00:00.000Z",
      "2025-11-01T00:00:00.000Z",
      "2025-12-01T00:00:00.000Z",
    ],
  },
};

export default function AdminBookingChart({
  title,
  initialFilter = "7d",
}: FilterChartProps) {
  const [filter, setFilter] = React.useState<FilterKey>(initialFilter);

  const { series1, series2, categories } = dataSets[filter];

  const chartData = {
    series: [
      { name: "Series 1", data: series1 },
      { name: "Series 2", data: series2 },
    ],
    options: {
      chart: {
        height: 350,
        type: "area" as const,
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" as const },
      xaxis: {
        type: "datetime" as const,
        categories,
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" },
      },
    },
  };

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "1d", label: "1 ngày" },
    { key: "7d", label: "7 ngày" },
    { key: "30d", label: "30 ngày" },
    { key: "month", label: "Theo tháng" },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex justify-end bg-white">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterKey)}
            className="border rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {filterOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={320}
      />
    </div>
  );
}
