import React, { useState } from "react";
import axios from "axios";

const USER_API_ENDPOINT = "http://localhost:3000/api/attendance";

const DeleteSubjectExample = () => {
  const [subjectToDelete, setSubjectToDelete] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!subjectToDelete.trim()) {
      setMessage("Please enter a subject name.");
      return;
    }
    if (!token) {
      setMessage("No auth token found. Please login first.");
      return;
    }

    try {
      const response = await axios.delete(
        `${USER_API_ENDPOINT}/subject/${encodeURIComponent(subjectToDelete.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setSubjectToDelete("");
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage("Network or server error.");
      }
    }
  };

  return (
  <div className="pt-44" style={styles.container}>
    <h2 style={styles.heading}>Delete Subject</h2>

    <label htmlFor="subjectInput" style={styles.label}>
      Subject Name
    </label>
    <input
      id="subjectInput"
      type="text"
      value={subjectToDelete}
      onChange={(e) => setSubjectToDelete(e.target.value)}
      placeholder="Enter subject to delete"
      style={styles.input}
    />

    <button
      onClick={handleDelete}
      style={styles.button}
      aria-label="Delete subject"
    >
      Delete Subject
    </button>

    {message && <p style={styles.message}>{message}</p>}
  </div>
);

};

const styles = {
  container: {
    maxWidth: "420px",
    margin: "3rem auto",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "1.5rem",
  },
  input: {
    padding: "10px",
    width: "100%",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "1px solid #bbb",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 20px",
    width: "100%",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "1rem",
    color: "#555",
    textAlign: "center",
  },
};

export default DeleteSubjectExample;
