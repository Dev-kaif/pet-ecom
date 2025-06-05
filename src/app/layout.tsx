import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petpal",
  description: "E-comerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
