import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Stock Market Research Analyst",
  description: "Advanced financial intelligence platform",
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import { TopBar } from "@/components/layout/TopBar";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>

          <Navbar />
          <TopBar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" theme="dark" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
