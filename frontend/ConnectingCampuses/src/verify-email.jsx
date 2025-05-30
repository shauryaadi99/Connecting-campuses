// import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { USER_API_ENDPOINT } from "../constants";

import { useEffect, useState, useRef } from "react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const token = searchParams.get("token");
  const didCallRef = useRef(false);

  useEffect(() => {
    if (didCallRef.current) return;
    didCallRef.current = true;

    if (!token) {
      console.warn("⚠️ No token found in query parameters.");
      setStatus("Invalid or missing token.");
      toast.error("❌ Missing verification token.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${USER_API_ENDPOINT}/api/user/verify-email`,
          { params: { token } }
        );
        setStatus(response.data.message || "Email verified successfully!");
        toast.success("✅ Email verified! You can now log in.");
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        const message =
          err.response?.data?.message || "Verification failed. Try again.";
        setStatus(message);
        toast.error("❌ Verification failed.");
      }
    };

    verifyToken();
  }, [token, navigate]);

 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-6 text-center">
    <Toaster position="top-center" reverseOrder={false} />
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 max-w-md w-full">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700 dark:text-blue-400">
        Email Verification
      </h1>
      <p
        className={`text-lg mb-4 ${
          status.toLowerCase().includes("success")
            ? "text-green-600"
            : status.toLowerCase().includes("failed") ||
              status.toLowerCase().includes("error")
            ? "text-red-600"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {status ||
          "Please wait while we verify your email. This should only take a moment."}
      </p>
      {status.toLowerCase().includes("success") && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You will be redirected shortly...
        </p>
      )}
      {(status.toLowerCase().includes("failed") ||
        status.toLowerCase().includes("error") ||
        status.toLowerCase().includes("invalid")) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If the problem persists, please request a new verification email or
          contact support.
        </p>
      )}
    </div>
  </div>
);

}
