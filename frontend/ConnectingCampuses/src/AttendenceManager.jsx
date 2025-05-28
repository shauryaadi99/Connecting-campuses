import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "../constants.js";
import AttendanceChart from "./connectingcomponents/AttendenceChart";
import AttendanceModal from "./connectingcomponents/AttendenceModal";
import Calendar from "./connectingcomponents/Calender";
import Navbar from "./connectingcomponents/MyattendanceNavbar";
import { useAuth } from "./context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AttendenceManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [modalDate, setModalDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access attendance manager.");
      navigate("/");
      return;
    }

    const fetchAttendance = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");

        if (!token) {
          toast.error("No token found. Redirecting to login.");
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${USER_API_ENDPOINT}/api/attendance/`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          toast.error("No attendance records found.");
          return;
        }

        const subs = data.map((rec) => rec.subject);
        setSubjects(subs);

        const attendanceData = {};
        data.forEach(({ subject, records }) => {
          if (subject && records) {
            attendanceData[subject] = records;
          }
        });

        setAttendance(attendanceData);
        if (subs.length > 0) setSelectedSubject(subs[0]);
      } catch (error) {
        const msg =
          error.response?.statusText ||
          error.message ||
          "An error occurred while fetching attendance.";
        toast.error(`Error: ${msg}`);
      }
    };

    fetchAttendance();
  }, [user, navigate]);

  const updateAttendance = async (date, status) => {
    if (!selectedSubject) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found");
        return;
      }

      await axios.post(
        `${USER_API_ENDPOINT}/api/attendance/`,
        {
          subject: selectedSubject,
          date,
          status: status.toLowerCase(),
        },
        { withCredentials: true }
      );

      setAttendance((prev) => {
        const updated = { ...prev };
        if (!updated[selectedSubject]) updated[selectedSubject] = {};
        updated[selectedSubject][date] = status;
        return updated;
      });

      setModalDate(null);
    } catch (error) {
      toast.error("Failed to update attendance.");
    }
  };

  const getChartDataForSubject = (subject) => {
    const records = attendance[subject] || {};
    const statusCounts = { present: 0, absent: 0, cancelled: 0 };

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
