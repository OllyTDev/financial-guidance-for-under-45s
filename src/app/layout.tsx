import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SecurityMetaTags } from "@/components/security/security-meta-tags";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Financial Guidance",
  description:
    "Information and guidance to help you manage your finances. No data leaves your device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <SecurityMetaTags />
      </head>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
