"use client";
import { getDashboardRevenueChartAPI } from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function AdminRevenueChart() {
  const [year, setYear] = useState<number>(2025);

  const fetchRevenueChart = async (selectedYear: number) => {
    try {
      const res = await getDashboardRevenueChartAPI({ year: selectedYear });
      const data = res.data || [];

      const months = data.map((item: any) => item.month);
      console.log("month", months);
      const revenues = data.map((item: any) => item.revenue);

      setChartData((prev: any) => ({
        ...prev,
        series: [{ name: "Doanh thu", data: revenues }],
        options: {
          ...prev.options,
          xaxis: { categories: months },
        },
      }));
    } catch (error) {
      console.log("get revenue chart err", error);
    }
  };

  useEffect(() => {
    fetchRevenueChart(year);
  }, [year]);

  const [chartData, setChartData] = useState<any>({
    series: [{ name: "Doanh thu", data: [] }],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end" as const,
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: { text: "VND (nghìn)" },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val: number) => val.toLocaleString("vi-VN") + "₫",
        },
      },
    },
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Doanh thu năm {year}</h3>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none bg-gray-100"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={320}
      />
    </div>
  );
}
