import type { Metadata } from "next";

import "./globals.css";

import SessionProvider from "@/components/ui/SessionProvider";

export const metadata: Metadata = {
  title: "Petpal - Your Ultimate Pet & Product Store",
  description:
    "E-commerce website to find your perfect pet and the best pet products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
