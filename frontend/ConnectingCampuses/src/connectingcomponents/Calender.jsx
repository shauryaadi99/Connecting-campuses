import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

// Map lowercase statuses directly from API to Tailwind classes
const statusColors = {
  present: "bg-green-500 text-white",
  absent: "bg-red-500 text-white",
  cancelled: "bg-gray-400 text-white",
};

const Calendar = ({
  subject,
  attendance = {},
  setModalDate,
  currentMonth,
  setCurrentMonth,
}) => {
  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfMonth(currentMonth);

  const getStatus = (date) => {
    if (!subject || !attendance[subject]) return null;
    return attendance[subject][format(date, "yyyy-MM-dd")];
  };

  const renderDays = () => {
    const days = [];
    let date = start;

    while (date <= end || format(date, "EEEE") !== "Sunday") {
      const formatted = format(date, "d");
      const fullDate = format(date, "yyyy-MM-dd");
      const status = getStatus(date);
      const isInMonth = isSameMonth(date, currentMonth);

      days.push(
        <div
          key={fullDate}
          onClick={() => isInMonth && setModalDate(fullDate)}
          className={`flex items-center justify-center p-3 rounded-lg shadow-sm transition transform cursor-pointer
            hover:scale-110 hover:shadow-lg 
            ${
              isInMonth
                ? statusColors[status?.toLowerCase()] || "bg-white text-gray-800"
                : "bg-gray-100 text-gray-400 pointer-events-none"
            }
            ${isInMonth && !status ? "hover:bg-blue-100" : ""}
          `}
          title={isInMonth ? `${formatted} - ${status || "No record"}` : ""}
        >
          <span className="select-none font-semibold">{formatted}</span>
        </div>
      );
      date = addDays(date, 1);
    }
    return days;
  };

  return (
    <div className="flex flex-col w-full md:w-3/5 bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between mb-4 items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Previous Month"
        >
          ◀
        </button>
        <h2 className="text-2xl font-bold text-gray-800 select-none">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Next Month"
        >
          ▶
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-600 mb-3 select-none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>

      {/* Legend */}
      <div className="flex space-x-6 mt-6 justify-center text-sm text-gray-700 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500 rounded-full shadow-inner"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-red-500 rounded-full shadow-inner"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-400 rounded-full shadow-inner"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
