import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AttendanceModal = ({ date, onClose, onSelect }) => {
  if (!date) return null;

  return (
  <Modal
    isOpen={!!date}
    onRequestClose={onClose}
    className="bg-white rounded-xl shadow-2xl max-w-xs mx-auto p-6 outline-none relative transform transition-transform duration-300 ease-in-out scale-100"
    overlayClassName="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-900 tracking-wide">
      Mark Attendance for <span className="text-indigo-600">{date}</span>
    </h2>

    <div className="flex flex-col gap-4">
      <button
        onClick={() => onSelect(date, "Present")}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        ✅ Present
      </button>

      <button
        onClick={() => onSelect(date, "Absent")}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        ❌ Absent
      </button>

      <button
        onClick={() => onSelect(date, "Cancelled")}
        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        🚫 Cancelled
      </button>
    </div>

    <button
      onClick={onClose}
      className="mt-8 block mx-auto text-indigo-600 font-semibold hover:underline focus:outline-none"
    >
      Close
    </button>
  </Modal>
);


};

export default AttendanceModal;
