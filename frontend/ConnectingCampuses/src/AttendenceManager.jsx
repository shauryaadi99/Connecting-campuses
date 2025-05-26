import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "../constants.js";
import AttendanceChart from "./connectingcomponents/AttendenceChart";
import AttendanceModal from "./connectingcomponents/AttendenceModal";
import Calendar from "./connectingcomponents/Calender";
import Navbar from "./connectingcomponents/MyattendanceNavbar";
import { useAuth } from "./context/AuthContext"; // Adjust the import path as necessary
import toast, { Toaster } from "react-hot-toast";

const AttendenceManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [modalDate, setModalDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Add this inside the AttendenceManager component, before the return statement

  useEffect(() => {
    if (!user) {
      alert(
        "No user logged in, redirecting to home.\nPlease log in to access the attendance manager."
      );
      window.location.href = "/";
      return;
    }

    const fetchAttendance = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");
        console.log("[AttendenceManager] fetchAttendance token:", token);

        if (!token) {
          console.error(
            "[AttendenceManager] No token found, redirecting to login."
          );
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${USER_API_ENDPOINT}/api/attendance/`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "[AttendenceManager] fetchAttendance response data:",
          response.data
        );

        const data = response.data;

        const subs = data.map((rec) => rec.subject);
        console.log("[AttendenceManager] Subjects found:", subs);
        setSubjects(subs);

        const attendanceData = {};
        data.forEach(({ subject, records }) => {
          attendanceData[subject] = records;
        });
        console.log(
          "[AttendenceManager] Processed attendance data:",
          attendanceData
        );
        setAttendance(attendanceData);

        if (subs.length > 0) {
          setSelectedSubject(subs[0]);
          console.log("[AttendenceManager] Default selectedSubject:", subs[0]);
        }
      } catch (error) {
        console.error("[AttendenceManager] Failed to fetch attendance:", error);
      }
    };

    fetchAttendance();
  }, [user, navigate]);

  const updateAttendance = async (date, status) => {
    if (!selectedSubject) {
      console.warn(
        "[AttendenceManager] No subject selected. Cannot update attendance."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("[AttendenceManager] updateAttendance token:", token);

      if (!token) {
        console.error("[AttendenceManager] No token found");
        return;
      }

      console.log(
        `[AttendenceManager] Updating attendance - subject: ${selectedSubject}, date: ${date}, status: ${status.toLowerCase()}`
      );

      await axios.post(
        `${USER_API_ENDPOINT}/api/attendance/`,
        {
          subject: selectedSubject,
          date: date, // example: "2025-05-22"
          status: status.toLowerCase(), // ensure lowercase
        },
        {
          withCredentials: true,
        }
      );

      setAttendance((prev) => {
        const updated = { ...prev };
        if (!updated[selectedSubject]) updated[selectedSubject] = {};
        updated[selectedSubject][date] = status;
        console.log("[AttendenceManager] Updated attendance state:", updated);
        return updated;
      });

      setModalDate(null);
    } catch (error) {
      console.error("[AttendenceManager] Failed to update attendance:", error);
    }
  };

  const getChartDataForSubject = (subject) => {
    const records = attendance[subject] || {};
    const statusCounts = {
      present: 0,
      absent: 0,
      cancelled: 0,
    };

    Object.values(records).forEach((status) => {
      const normalized = status.toLowerCase();
      if (statusCounts.hasOwnProperty(normalized)) {
        statusCounts[normalized]++;
      }
    });

    return statusCounts;
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-100 pt-24 px-4">
        <Navbar
          subjects={subjects}
          setSubjects={setSubjects}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />
        {selectedSubject && (
          <div className="flex flex-col md:flex-row mt-6 gap-4">
            <Calendar
              subject={selectedSubject}
              attendance={attendance}
              setModalDate={setModalDate}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
            <AttendanceChart data={getChartDataForSubject(selectedSubject)} />
          </div>
        )}
        <AttendanceModal
          date={modalDate}
          onClose={() => setModalDate(null)}
          onSelect={updateAttendance}
        />
      </div>
    </>
  );
};

export default AttendenceManager;
