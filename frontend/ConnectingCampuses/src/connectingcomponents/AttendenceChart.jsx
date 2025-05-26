import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const AttendanceChart = ({ data = {} }) => {
  const counts = {
    Present: data.present || 0,
    Absent: data.absent || 0,
    Cancelled: data.cancelled || 0,
  };

  const total = counts.Present + counts.Absent;

  const chartData = {
    labels: ["Present", "Absent", "Cancelled"],
    datasets: [
      {
        data: [counts.Present, counts.Absent, counts.Cancelled],
        backgroundColor: ["#34D399", "#F87171", "#D1D5DB"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full md:w-2/5 bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center p-6 border border-white border-opacity-30">
      <h3 className="text-2xl font-extrabold mb-4 text-gray-900 drop-shadow-md">
        Attendance Summary
      </h3>
      <div className="w-96 h-96">
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="mt-6 text-center text-base font-semibold text-gray-800 tracking-wide drop-shadow-sm">
        {`${counts.Present}/${total} Present`} (
        {total ? ((counts.Present / total) * 100).toFixed(1) : 0}%)
      </div>
    </div>
  );
};

export default AttendanceChart;
