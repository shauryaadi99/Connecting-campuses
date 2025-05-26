import React, { useState } from "react";
import axios from "axios";

const ClearAttendanceButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const clearAttendance = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear ALL attendance data? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        "http://localhost:3000/api/attendance/allclear",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setMessage(
        response.data.message || "Attendance data cleared successfully."
      );
    } catch (error) {
      console.error("Failed to clear attendance:", error);
      setMessage("Failed to clear attendance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-4 flex justify-center">
      <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-sm text-center">
        <button
          onClick={clearAttendance}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded transition-colors duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 cursor-pointer"
          } text-white`}
        >
          {loading ? "Clearing..." : "Clear All Attendance"}
        </button>
        {message && (
          <p className="mt-4 text-gray-800 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ClearAttendanceButton;
