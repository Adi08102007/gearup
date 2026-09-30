import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/lib/app-context";

export const metadata: Metadata = {
  title: "GearUp — Automotive Care & Roadside Assistance Platform",
  description: "Find trusted rated mechanics, book onsite & offsite vehicle service, and request emergency highway towing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-wire-100 dark:bg-wire-950 text-wire-900 dark:text-wire-100 antialiased selection:bg-wire-900 selection:text-white transition-colors duration-200">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-wire-300 dark:border-wire-800 bg-white dark:bg-wire-900 py-6 text-center text-xs text-wire-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-wire-800 dark:text-wire-200">⚙️ GearUp Technologies Inc.</span>
                <span>•</span>
                <span>Customer • Workshop • Crane Fleet Network</span>
              </div>
              <div className="text-wire-500">
                Verified Certified Garages • 24/7 Roadside Assistance
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
