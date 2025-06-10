"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// Variants for page fade-in
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setMessageType(null);

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setMessageType("error");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! You can now log in.");
        setMessageType("success");
        // Clear form after successful submission
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
        // Handle API errors (e.g., user already exists, invalid data from backend)
        setMessage(
          data.error || "An unexpected error occurred during sign up."
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      setMessage("Failed to connect to the server. Please try again later.");
      setMessageType("error");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen-minus-nav min-h-screen"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                id="name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading} // Disable input while loading
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
                disabled={isLoading} // Disable input while loading
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
                disabled={isLoading} // Disable input while loading
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                id="confirmPassword"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading} // Disable input while loading
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn-bubble btn-bubble-primary w-full py-3 text-lg flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading} // Disable button while loading
          >
            <span>
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-3"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </span>
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <a
            href="#"
            className="text-primary hover:underline font-medium"
            onClick={() => router.push("/login")}
          >
            {" "}
            {/* Replace with actual navigation */}
            Login
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
