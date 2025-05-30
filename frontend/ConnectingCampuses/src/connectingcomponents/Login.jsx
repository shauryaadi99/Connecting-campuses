"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { USER_API_ENDPOINT } from "../../constants";

import { SignupFormDemo } from "./Signup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// adjust path if needed

const LoginForm = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resendVerification = async () => {
    try {
      setLoading(true);
      await axios.post(`${USER_API_ENDPOINT}/api/user/resend-verification`, {
        email: formData.email,
      });
      toast.success("Verification email resent. Please check your inbox.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (onClose) onClose(); // Close login popup/modal
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    console.log("Login form submitted with data:", formData);

    if (!formData.email || !formData.password) {
      setErrorMsg("Both fields are required.");
      setLoading(false);
      console.log("Login failed: missing email or password");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/api/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Important: send cookies with request
        }
      );

      console.log("Login API response:", res.data);

      if (!res.data.success) {
        setErrorMsg(res.data.message || "Login failed.");
        setLoading(false);
        console.log("Login failed: success flag false");
        return;
      }

      const user = res.data.user;

      // Store user info only, no token
      localStorage.setItem("user", JSON.stringify(user));

      console.log("User stored:", localStorage.getItem("user"));

      if (!user.isVerified) {
        setErrorMsg("Please verify your email before logging in.");
        toast.error("Please verify your email to activate your account.");
        setLoading(false);
        return;
      }
      console.log("User from server:", user);

      // No token in localStorage, no need to set axios default headers here
      // Because the token is automatically sent in cookies with future requests (if withCredentials is set)

      login(user); // from AuthContext

      const username = user?.name || user?.email || "User";
      setAlert({
        message: `Welcome back, ${username}! Redirecting to home...`,
        type: "success",
      });
      toast.success(`Welcome back, ${username}!`);

      setTimeout(() => {
        window.location.href = "/profile";
      }, 100);

      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) {
    return (
      <div className="w-full flex justify-center">
        <div className="shadow-input w-full max-w-md rounded-lg bg-transparent p-6 dark:bg-black">
          <SignupFormDemo setShowSignup={setShowSignup} />
          <div className="mt-4 text-center">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="text-blue-500 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <div className="w-full flex justify-center">
        <div className="shadow-input w-full max-w-md rounded-lg bg-transparent p-6 dark:bg-black">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Login with your BIT Mesra email
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

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="text-sm text-red-500 font-medium">{errorMsg}</div>
            )}

            {!loading &&
              errorMsg === "Please verify your email before logging in." && (
                <div className="mt-2 text-sm">
                  <button
                    onClick={resendVerification}
                    className="text-blue-600 hover:underline"
                  >
                    Didn’t get the email? Resend verification link
                  </button>
                </div>
              )}

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="btechXXXX.2X@bitmesra.ac.in"
                required
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
                required
              />
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading}
              className="group/btn mt-4 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login →"}
              <BottomGradient />
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="text-blue-500 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>

          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </>
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

// ----- LOGOUT FUNCTION (use it wherever needed) -----
// Example usage:
// import { useDispatch } from "react-redux";
// import { setUser } from "../redux/authSlice";
// const dispatch = useDispatch();
// logout(dispatch);

export const logout = (logoutFn) => {
  localStorage.removeItem("user");
  logoutFn(); // This calls the `logout` from AuthContext
};

export default LoginForm;
