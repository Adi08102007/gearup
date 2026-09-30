"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShieldAlert, Truck, Car, Home, Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";

export default function Navbar() {
  const pathname = usePathname();
  const { isCloudConnected } = useApp();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/customer", label: "Customer Portal", icon: Car },
    { href: "/mechanic", label: "Mechanic Portal", icon: Wrench },
    { href: "/crane", label: "Crane Recovery", icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0c101c]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">GearUp</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">Vehicle Care, Garages & Recovery Fleet</p>
          </div>
        </Link>

        {/* Portal Switcher Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all",
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-slate-400")} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cloud DB Status */}
          <div
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border",
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
            {isCloudConnected ? <Cloud className="w-3.5 h-3.5 text-emerald-400" /> : <Database className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isCloudConnected ? "Supabase Cloud" : "Local DB"}</span>
          </div>

          {/* Quick Emergency SOS shortcut */}
          <Link
            href="/customer/sos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>SOS Crane</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
