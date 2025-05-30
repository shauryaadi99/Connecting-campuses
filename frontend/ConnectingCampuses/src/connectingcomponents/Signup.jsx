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

  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (alert.type === "success") {
      // Show resend button after 3 seconds delay
      const timer = setTimeout(() => {
        setShowResend(true);
      }, 3000);

      return () => clearTimeout(timer); // cleanup timer if component unmounts or alert changes
    } else {
      setShowResend(false);
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
      console.log("🚀 Submitting signup form with data:", formData);

      setAlert({
        message:
          response.data.message ||
          "🎉 Account created! Please verify your email.",
        type: "success",
      });

      toast.success("✅ Please verify your email to activate your account.");
      // Don't auto-switch to login
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      setAlert({ message, type: "error" });

      // Optional: flag to show resend button
      if (message.includes("already exists")) {
        setShowResend(true);
      }
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
              className="group/btn mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            >
              Sign up &rarr;
              <BottomGradient />
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
