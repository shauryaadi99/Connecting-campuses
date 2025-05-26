import React, { useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../constants";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

const Navbar = ({
  subjects,
  setSubjects,
  selectedSubject,
  setSelectedSubject,
}) => {
  const [newSubject, setNewSubject] = useState("");
  const { token, user } = useAuth(); // Use token from your Auth context
  // const token = localStorage.getItem("token"); // Fallback if not using context
  console.log("Navbar token:", token);

  const addSubject = () => {
  const trimmedSubject = newSubject.trim().toUpperCase(); // Convert to uppercase
  if (!trimmedSubject) return;

  if (!subjects.includes(trimmedSubject)) {
    setSubjects([...subjects, trimmedSubject]);
    setSelectedSubject(trimmedSubject);
    setNewSubject("");
    console.log("Subject added successfully:", trimmedSubject);
  } else {
    alert("Subject already exists");
  }
};


  const removeSubject = async (subject) => {
    if (!token) {
      alert("User not authenticated");
      console.warn("No token found, aborting subject removal.");
      return;
    }

    try {
      // DELETE request with subject in request body
      const response = await axios.delete(
        `${USER_API_ENDPOINT}/api/attendance/subject/${encodeURIComponent(
          subject
        )}`,
        {
          withCredentials: true,
        }
      );

      console.log("Delete request successful:", response.data);

      // Remove subject locally after successful delete
      setSubjects(subjects.filter((s) => s !== subject));

      // Reset selected subject if it was deleted
      if (selectedSubject === subject) {
        setSelectedSubject(null);
        console.log("Removed selected subject, resetting selection.");
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject from database.");
    }
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 md:p-5 rounded-3xl shadow-lg border border-blue-200">
      <div className="text-3xl font-extrabold text-blue-700 tracking-wide select-none mb-4 md:mb-0">
        📘 MyAttendance
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto overflow-x-auto md:overflow-visible scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {subjects.map((subject) => (
          <div
            key={subject}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-sm cursor-pointer select-none whitespace-nowrap
              ${
                selectedSubject === subject
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
              }`}
            onClick={() => setSelectedSubject(subject)}
            title="Click to select"
          >
            {subject}
            <button
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                removeSubject(subject);
              }}
              title="Remove subject"
            >
              ✖
            </button>
          </div>
        ))}

        <div className="flex items-center gap-2 min-w-[140px] md:min-w-[180px] flex-shrink-0">
          <input
            type="text"
            className="border border-blue-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="New Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubject()}
          />
          <button
            onClick={addSubject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none transition whitespace-nowrap"
            aria-label="Add new subject"
          >
            ➕ Add
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
