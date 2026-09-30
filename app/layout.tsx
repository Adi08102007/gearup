import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/lib/app-context";

export const metadata: Metadata = {
  title: "GearUp | Automotive Ecosystem Platform",
  description: "Connected vehicle owner portal, certified garage operations, and 24/7 highway recovery crane fleet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-[#070a12] py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400">GearUp Platform</span>
                <span>•</span>
                <span>Customer • Mechanic • Crane Recovery</span>
              </div>
              <div className="text-slate-500">
                Kerala Regional Fleet Network • Verified ISO 9001 Garages
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
