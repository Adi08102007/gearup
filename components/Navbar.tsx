"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();

  const isCustomer = currentUser?.role === "customer";
  const isMechanic = currentUser?.role === "mechanic";
  const isCrane = currentUser?.role === "crane";

  const customerNavLinks = [
    { href: "/customer/find-mechanic", label: "Find Mechanic" },
    { href: "/customer/sos", label: "Crane" },
    { href: "/customer/my-vehicles", label: "My Vehicles" },
    { href: "/customer/history", label: "Service History" },
    { href: "/customer#bookings", label: "Bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-wire-900 border-b border-wire-300 dark:border-wire-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded border border-wire-900 dark:border-white flex items-center justify-center font-bold text-sm bg-white dark:bg-wire-900 text-wire-900 dark:text-white">
              ⚙️
            </span>
            <span className="font-mono font-black text-lg tracking-wider text-wire-900 dark:text-white">
              GEARUP
              {isMechanic && (
                <span className="ml-1.5 text-[10px] font-sans font-normal bg-wire-200 dark:bg-wire-800 text-wire-700 dark:text-wire-300 px-1.5 py-0.5 rounded">
                  FOR MECHANICS
                </span>
              )}
              {isCrane && (
                <span className="ml-1.5 text-[10px] font-sans font-normal bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-1.5 py-0.5 rounded">
                  CRANE OPS
                </span>
              )}
            </span>
          </Link>

          {/* Customer Navigation Links (ONLY when logged in as Customer) */}
          {currentUser && isCustomer && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-wire-600 dark:text-wire-300">
              {customerNavLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "hover:text-wire-900 dark:hover:text-white transition",
                      isActive ? "text-wire-900 dark:text-white font-bold" : ""
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Area: Logged Out vs Logged In */}
        {!currentUser ? (
          /* ========================================================= */
          /* LOGGED-OUT TOP BAR (Shows ONLY: Logo, Language, Login, Sign up) */
          /* ========================================================= */
          <div className="flex items-center gap-3 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-wire-300 dark:border-wire-700 rounded px-2 py-1 text-wire-600 dark:text-wire-300 cursor-pointer">
              <span>🌐</span>
              <span>EN</span>
              <span className="text-wire-400">▾</span>
            </div>

            {/* Login & Sign Up Buttons */}
            <Link
              href="/login"
              className="px-3 py-1.5 border border-wire-400 dark:border-wire-600 rounded font-medium hover:border-wire-900 dark:hover:border-white text-wire-900 dark:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold hover:opacity-90 transition shadow-sm"
            >
              Sign up
            </Link>
          </div>
        ) : (
          /* ========================================================= */
          /* LOGGED-IN CONTROLS (Role specific, zero personal names)   */
          /* ========================================================= */
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mechanic Status Switch (Mechanic Role Only) */}
            {isMechanic && (
              <div className="flex items-center bg-wire-100 dark:bg-wire-800 p-0.5 rounded-lg border border-wire-300 dark:border-wire-700 text-xs font-medium">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-wire-700 shadow-sm text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Available</span>
                </span>
              </div>
            )}

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs border border-wire-300 dark:border-wire-700 rounded px-2 py-1 text-wire-600 dark:text-wire-300 cursor-pointer">
              <span>🌐</span>
              <span>EN</span>
              <span className="text-wire-400">▾</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-1.5 text-wire-700 dark:text-wire-300 hover:text-wire-900 border border-wire-300 dark:border-wire-700 rounded">
              <span>🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            {/* Generic Profile Pill (Zero Personal Names) */}
            <div className="relative group">
              <button className="flex items-center gap-2 border border-wire-300 dark:border-wire-700 rounded-full pl-1.5 pr-2.5 py-1 text-xs text-wire-800 dark:text-wire-200 hover:border-wire-500 bg-white dark:bg-wire-800">
                <span className="w-6 h-6 rounded-full bg-wire-200 dark:bg-wire-700 flex items-center justify-center text-xs font-mono font-bold">
                  {isMechanic ? "🔧" : isCrane ? "🏗️" : "👤"}
                </span>
                <span className="font-medium hidden sm:inline">{currentUser.name}</span>
                <span className="text-wire-400 text-[10px]">▾</span>
              </button>

              {/* Profile Dropdown Menu */}
              <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-50 w-44">
                <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-lg shadow-lg py-1 text-xs text-wire-700 dark:text-wire-200">
                  <div className="px-3 py-1.5 border-b border-wire-200 dark:border-wire-800 text-[11px] text-wire-500">
                    Logged in as {currentUser.role}
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-wire-100 dark:hover:bg-wire-800 flex items-center gap-2 font-medium"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Emergency SOS Button */}
            {isCustomer && (
              <Link
                href="/customer/sos"
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition shadow-sm animate-emerg"
              >
                <span>🚨</span>
                <span className="hidden sm:inline">Emergency SOS</span>
              </Link>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
