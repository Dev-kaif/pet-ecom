"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Toaster
        position="top-center" // Adjust position as needed (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        reverseOrder={false} // New toasts appear at the bottom of existing ones
        gutter={8} // Space between toasts
        containerClassName="" // Custom class for the container
        containerStyle={{
          // Custom styles for the container
          zIndex: 9999, // Ensure toasts are on top
        }}
        toastOptions={{
          // Default options for all toasts
          className: "",
          duration: 3000, // Default duration in ms
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000, 
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}
