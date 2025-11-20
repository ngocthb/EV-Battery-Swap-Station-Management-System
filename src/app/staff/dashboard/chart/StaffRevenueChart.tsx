"use client";
import useFetchList from "@/hooks/useFetchList";
import {
  getStaffDashboardRevenueChartAPI,
} from "@/services/dashboardService";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function StaffRevenueChart() {
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Format yyyy-mm-dd
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState<string>(formatDate(sevenDaysAgo));
  const [toDate, setToDate] = useState<string>(formatDate(today));

  const fetchRevenueChart = async (
    from: string,
    to: string,
  ) => {
    try {
      const res = await getStaffDashboardRevenueChartAPI({
        from,
        to,
      });

      const data = res.data || [];
      const months = data.map((i: any) => i.date);
      const revenues = data.map((i: any) => i.revenue);

      setChartData((prev: any) => ({
        ...prev,
        series: [
          {
            name: "Doanh thu",
            data: revenues.length > 0 ? revenues : [],
          },
        ],
        options: {
          ...prev.options,
          xaxis: {
            categories: months.length > 0 ? months : [],
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRevenueChart(fromDate, toDate);
  }, [fromDate, toDate]);

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
        <h3 className="font-bold text-gray-800">Doanh thu</h3>
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm bg-gray-100"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-full px-3 py-1 text-sm bg-gray-100"
          />
        </div>
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
