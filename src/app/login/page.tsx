"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react"; // Icons for input fields
import { signIn } from "next-auth/react"; // Import signIn function from next-auth
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const router = useRouter(); // Initialize router

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setMessageType(null);

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setMessageType("error");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent NextAuth.js from redirecting automatically
      });

      if (res?.ok) {
        // Login successful, redirect to home page
        router.push("/admin");
      } else {
        // Login failed, display error message
        setMessage("Login failed. Please check your credentials.");
        setMessageType("error");
        // As per the prompt, using alert for failed login
        // IMPORTANT: In a production app, custom modal UI is preferred over alert()
        alert("Login failed");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setMessage("An unexpected error occurred. Please try again later.");
      setMessageType("error");
      // As per the prompt, using alert for general error
      alert("An unexpected error occurred.");
    } finally {
      setPassword(""); // Always clear password field for security
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen-minus-nav my-32"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 mb-4 rounded-md text-sm ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                id="email"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                id="password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <p className="text-right text-sm">
            <a
              href="#"
              className="text-primary hover:underline font-medium"
              onClick={() => alert("Navigate to Forgot Password page")}
            >
              {" "}
              {/* Replace with actual navigation */}
              Forgot Password?
            </a>
          </p>

          <motion.button
            type="submit"
            className="btn-bubble btn-bubble-primary w-full py-3 text-lg flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Login</span>
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="text-primary hover:underline font-medium"
            onClick={() => router.push("/signup")}
          >
            {" "}
            {/* Replace with actual navigation */}
            Sign Up
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
