import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { USER_API_ENDPOINT } from "../constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const UpdateProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("User object from useAuth:", user);

  if (!user) {
    console.error("User not authenticated, redirecting to login.");
    navigate("/");
    return null;
  }

  // Initialize form data as empty but placeholders come from user
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    graduatingYear: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(null);

    // Prepare data to send, fallback to stored user data if input is empty
    const dataToSend = {
      name:
        formData.name.trim() === ""
          ? user.name || user.fullname || ""
          : formData.name,
      phone:
        formData.phone.trim() === ""
          ? user.phone || user.phoneNumber || ""
          : formData.phone,
      graduatingYear:
        formData.graduatingYear.trim() === ""
          ? user.graduatingYear?.toString() || ""
          : formData.graduatingYear,
    };

    console.log("Submitting form with data:", dataToSend);

    try {
      const response = await axios.put(
        `${USER_API_ENDPOINT}/api/user/update-profile`,
        dataToSend,
        {
          withCredentials: true,
        }
      );

      console.log("Response from update-profile API:", response);

      setMessage(response.data.message);
      setSuccess(true);

      const updatedUser = response.data.user;
      console.log("Updated user from response:", updatedUser);

      // Normalize keys
      const cleanedUser = {
        ...updatedUser,
        name: updatedUser.fullname || updatedUser.name,
        phone: updatedUser.phoneNumber || updatedUser.phone,
      };

      localStorage.setItem("user", JSON.stringify(cleanedUser));
      console.log("Updated localStorage user:", cleanedUser);

      navigate("/profile");
    } catch (error) {
      console.error("Error during update-profile API call:", error);

      setMessage(error.response?.data?.message || "Failed to update profile.");
      setSuccess(false);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received, request was:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="update-profile-form bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <LabelInputContainer>
            <label
              htmlFor="name"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Full Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={user.name || user.fullname || "Enter your full name"}
              className="rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-500
                       transition duration-300 ease-in-out"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label
              htmlFor="phone"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Phone Number:
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={user.phone || user.phoneNumber || "10-digit number"}
              className="rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-500
                       transition duration-300 ease-in-out"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label
              htmlFor="graduatingYear"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Graduating Year:
            </label>
            <input
              id="graduatingYear"
              type="number"
              name="graduatingYear"
              value={formData.graduatingYear}
              onChange={handleChange}
              placeholder={user.graduatingYear?.toString() || "e.g., 2026"}
              className="rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-500
                       transition duration-300 ease-in-out"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <label
              htmlFor="email"
              className="text-base font-semibold text-gray-700 dark:text-gray-300 cursor-not-allowed"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
              placeholder={user.email || "e.g., john.doe@example.com"}
              readOnly
              className="rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-900 placeholder-gray-400 shadow-sm
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
             dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-500
             transition duration-300 ease-in-out cursor-not-allowed disabled:cursor-not-allowed"
            />
          </LabelInputContainer>

          <button
            type="submit"
            disabled={loading}
            className="group/btn relative w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white text-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700
                     focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50
                     disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
          >
            {loading ? "Updating..." : "Update Profile"}
            <BottomGradient />
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-base font-medium ${
              success ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>
    {children}
  </div>
);

export default UpdateProfileForm;
