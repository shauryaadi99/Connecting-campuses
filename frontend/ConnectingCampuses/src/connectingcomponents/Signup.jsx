"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../constants";
import toast, { Toaster } from "react-hot-toast";

export function SignupFormDemo({ setShowSignup }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    graduatingYear: "",
  });
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(null); // null, true, or false

  useEffect(() => {
    if (alert.type === "success") {
      // Show resend button after 3 seconds delay
      const timer = setTimeout(() => {
        setShowResend(true);
      }, 3000);

      return () => clearTimeout(timer); // cleanup timer if component unmounts or alert changes
    } 
  }, [alert]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const resendVerification = async () => {
    try {
      await axios.post(`${USER_API_ENDPOINT}/api/user/resend-verification`, {
        email: formData.email,
      });

      toast.success("📧 Verification email resent. Check your inbox.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: "", type: "" });
    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/api/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAlert({
        message:
          response.data.message ||
          "🎉 Account created! Please verify your email.",
        type: "success",
      });

      toast.success("✅ Please verify your email to activate your account.");
    } catch (error) {
      const message = error.response?.data?.message;
      
      if (message.includes("not verified")) {
        // optionally show "Resend verification email" button
        setShowResend(true);
        setAlert({
          message: "You are already registered but not verified.",
          type: "warning",
        });
      } else if (message.includes("verified")) {
        setAlert({
          message: "User already registered. Please log in.",
          type: "info",
        });
      } else {
        setAlert({ message: "Signup failed. Try again.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-h-[90vh] overflow-y-auto w-full">
        <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-transparent md:p-6 dark:bg-black custom-scrollbar">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Connecting Campuses
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Sign up using your BIT Mesra email. A verification link will be sent
            to you.
          </p>

          {alert.message && (
            <div
              className={cn(
                "mt-4 px-4 py-2 rounded-md text-sm font-medium",
                alert.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {alert.message}
            </div>
          )}

          {showResend && (
            <div className="mt-2 text-sm">
              <button
                type="button"
                onClick={resendVerification}
                className="text-blue-600 hover:underline"
              >
                Didn’t get the email? Resend verification link
              </button>
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <LabelInputContainer>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="btech10467.23@bitmesra.ac.in"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="graduatingYear">Graduating Year</Label>
              <Input
                id="graduatingYear"
                value={formData.graduatingYear}
                onChange={handleChange}
                placeholder="2027"
                type="number"
              />
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading || isRegistered}
              className={cn(
                "group/btn mt-4 relative block h-10 w-full rounded-md text-sm font-medium text-white",
                "bg-gradient-to-br from-black to-neutral-600 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
                "dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
                (loading || isRegistered) && "opacity-60 cursor-not-allowed"
              )}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              ) : isRegistered && isVerified ? (
                <span className="text-sm font-medium text-white opacity-70">
                  User already registered. Please login.
                </span>
              ) : isRegistered && isVerified === false ? (
                <span className="text-sm font-medium text-white opacity-70">
                  You're already registered but not verified.
                </span>
              ) : (
                <>
                  Sign up &rarr;
                  <BottomGradient />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

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
