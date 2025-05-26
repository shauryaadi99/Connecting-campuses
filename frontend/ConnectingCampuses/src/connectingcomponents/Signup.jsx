"use client";
import React, { useState } from "react";
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

  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: "", type: "" });

    try {
      await axios.post(`${USER_API_ENDPOINT}/api/user/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setAlert({
        message: "🎉 Signed up successfully! Redirecting to login...",
        type: "success",
      });
      toast.success("🎉 Account created! You can now log in.");

      // Wait 2s before switching
      setTimeout(() => setShowSignup(false), 2000);
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Signup failed",
        type: "error",
      });
    }
  };

  return (
    <>
    <Toaster/>
      <div className="max-h-[90vh] overflow-y-auto w-full">
        <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-transparent md:p-6 dark:bg-black">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Connecting Campuses
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Signup using your BIT Mesra email to continue
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
