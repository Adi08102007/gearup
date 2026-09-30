"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShieldAlert, Truck, Car, Home, Database, Cloud, User as UserIcon, LogIn, LogOut, Search, Clock, History as HistoryIcon, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

export default function Navbar() {
  const pathname = usePathname();
  const { isCloudConnected, currentUser, logout } = useApp();

  const isCustomer = pathname.startsWith("/customer");
  const isMechanic = pathname.startsWith("/mechanic");
  const isCrane = pathname.startsWith("/crane");

  const portals = [
    { href: "/customer", label: "Customer", icon: Car },
    { href: "/mechanic", label: "Mechanic", icon: Wrench },
    { href: "/crane", label: "Crane Ops", icon: Truck },
  ];

  const customerNavLinks = [
    { href: "/customer/find-mechanic", label: "Find Mechanic" },
    { href: "/customer/sos", label: "Crane" },
    { href: "/customer/my-vehicles", label: "My Vehicles" },
    { href: "/customer/history", label: "Service History" },
    { href: "/customer#bookings", label: "Bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c101c]/95 backdrop-blur-md border-b border-wire-300 dark:border-wire-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo (NO VEHICLE CHIP in top bar as specified in wireframe) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-wire-900 text-white dark:bg-white dark:text-wire-900 flex items-center justify-center font-bold text-sm">
              ⚙️
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-base tracking-wider text-wire-900 dark:text-white">
                <span>GEARUP</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans">
                  {isMechanic ? "PRO" : isCrane ? "CRANE" : "v2.1"}
                </span>
              </div>
            </div>
          </Link>

          {/* Customer Specific Sub-nav links (Matches Wireframe 3) */}
          {isCustomer && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-wire-600 dark:text-wire-300">
              {customerNavLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "transition-colors hover:text-wire-900 dark:hover:text-white",
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

        {/* Portal Switcher Dropdown / Pills */}
        <div className="flex items-center gap-2">
          {/* Portal Switcher */}
          <div className="flex items-center bg-wire-100 dark:bg-wire-850 p-1 rounded-lg border border-wire-300 dark:border-wire-700 text-xs">
            {portals.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition flex items-center gap-1",
                    active
                      ? "bg-white dark:bg-wire-700 shadow-sm text-wire-900 dark:text-white font-bold"
                      : "text-wire-600 dark:text-wire-400 hover:text-wire-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Cloud DB Status */}
          <div
            className={cn(
              "hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border",
              isCloudConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-slate-800/80 text-slate-400 border-slate-700"
            )}
            title={
              isCloudConnected
                ? "Connected to Supabase PostgreSQL"
                : "Using local demo database (Add Supabase keys in .env.local to sync cloud)"
            }
          >
            {isCloudConnected ? <Cloud className="w-3 h-3 text-emerald-400" /> : <Database className="w-3 h-3 text-slate-400" />}
            <span>{isCloudConnected ? "Supabase Cloud" : "Local DB"}</span>
          </div>

          {/* User Account / Role Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-wire-100 dark:bg-wire-800 border border-wire-300 dark:border-wire-700 text-xs">
              <UserIcon className="w-3.5 h-3.5 text-wire-600 dark:text-wire-300" />
              <span className="font-semibold text-wire-900 dark:text-white max-w-[120px] truncate hidden md:inline">
                {currentUser.name}
              </span>
              <button
                onClick={logout}
                title="Sign out"
                className="text-wire-400 hover:text-red-500 transition-colors p-0.5"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wire-900 text-white dark:bg-white dark:text-wire-900 text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* Quick Emergency SOS button */}
          <Link
            href="/customer/sos"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm animate-emerg"
          >
            <span>🚨</span>
            <span className="hidden sm:inline">Emergency SOS</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
