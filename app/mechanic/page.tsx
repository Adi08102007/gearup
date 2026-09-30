"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { Wrench, Clock, CheckCircle2, Star, Check, X, Phone, AlertTriangle } from "lucide-react";

export default function MechanicDashboard() {
  const { bookings, updateBookingStatus, shops } = useApp();
  const currentShop = shops[0];

  // Status Switch (Available / Busy / Offline)
  const [mechanicStatus, setMechanicStatus] = useState<"available" | "busy" | "offline">("available");

  // 2-minute countdown timer simulation
  const [secondsLeft, setSecondsLeft] = useState(135);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeJobs = bookings.filter((b) => b.status === "accepted" || b.status === "in_progress");

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Top: Welcome + Big Status Switch (Matches Wireframe 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-wire-50 dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-4 md:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-wire-900 dark:text-white">
              {currentShop.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              LIVE
            </span>
          </div>
          <p className="text-xs text-wire-500">
            Station terminal •{" "}
            <span
              className={`font-bold ${
                mechanicStatus === "available"
                  ? "text-emerald-600"
                  : mechanicStatus === "busy"
                  ? "text-amber-600"
                  : "text-wire-500"
              }`}
            >
              {mechanicStatus === "available"
                ? "Available for breakdown calls"
                : mechanicStatus === "busy"
                ? "Busy on active breakdown"
                : "Offline • Not visible to customers"}
            </span>
          </p>
        </div>

        {/* Big Visual Status Toggle Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold text-wire-800 dark:text-wire-200">Current Radar</div>
            <div className="text-[10px] text-wire-500">15 km radius active</div>
          </div>
          <button
            onClick={() =>
              setMechanicStatus((prev) =>
                prev === "available" ? "busy" : prev === "busy" ? "offline" : "available"
              )
            }
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition ${
              mechanicStatus === "available"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : mechanicStatus === "busy"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-wire-700 hover:bg-wire-800 text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>
              {mechanicStatus === "available"
                ? "ONLINE & ACCEPTING"
                : mechanicStatus === "busy"
                ? "BUSY ON JOB"
                : "OFFLINE (HIDDEN)"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Today's Summary Metrics (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1 */}
        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-wire-500">New Requests</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-wire-900 dark:text-white font-mono">
              {pendingRequests.length}
            </span>
            <span className="text-[10px] text-red-600 font-bold bg-red-50 dark:bg-red-950/50 px-1 rounded">
              {formatTimer(secondsLeft)} left
            </span>
          </div>
          <div className="text-[10px] text-wire-500 mt-1">Requires immediate response</div>
        </div>

        {/* Metric 2 */}
        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-wire-500">Active Jobs</span>
            <span className="text-xs">🚐</span>
          </div>
          <div className="text-2xl font-bold text-wire-900 dark:text-white font-mono">
            {activeJobs.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">1 Onsite • 1 In Garage</div>
        </div>

        {/* Metric 3 */}
        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-wire-500">Completed Today</span>
            <span className="text-xs">✓</span>
          </div>
          <div className="text-2xl font-bold text-wire-900 dark:text-white font-mono">5</div>
          <div className="text-[10px] text-wire-500 mt-1">Avg turnaround: 42 mins</div>
        </div>

        {/* Metric 4 */}
        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-wire-500">Today&apos;s Earnings</span>
            <span className="text-xs">💰</span>
          </div>
          <div className="text-2xl font-bold text-wire-900 dark:text-white font-mono">₹4,250</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">+18% vs yesterday</div>
        </div>
      </div>

      {/* 3. Priority Urgent Request Card with 2-Minute SLA Countdown (Matches Wireframe 5) */}
      {pendingRequests.length > 0 && (
        <div className="border-2 border-red-500/80 rounded-xl p-4 bg-red-50/30 dark:bg-red-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                🚨 EMERGENCY BREAKDOWN
              </span>
              <span className="text-xs font-bold text-wire-900 dark:text-white">
                Customer breakdown 3.2 km away
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-700 dark:text-red-400 bg-white dark:bg-wire-900 px-2.5 py-1 rounded border border-red-300">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Expiring in: {formatTimer(secondsLeft)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-xs bg-white dark:bg-wire-900 p-3.5 rounded-lg border border-red-200 dark:border-red-900/50">
            <div>
              <div className="text-wire-500 text-[10px] uppercase font-mono">Customer & Vehicle</div>
              <div className="font-bold text-wire-900 dark:text-white text-sm">
                {pendingRequests[0].vehicle.make} {pendingRequests[0].vehicle.model}
              </div>
              <div className="text-wire-600 dark:text-wire-400 font-mono text-[11px]">
                {pendingRequests[0].vehicle.regNumber} • {pendingRequests[0].vehicle.currentKm.toLocaleString()} km
              </div>
            </div>

            <div>
              <div className="text-wire-500 text-[10px] uppercase font-mono">Location & Mode</div>
              <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1">
                <span>🚐 Onsite Service</span>
                <span className="text-xs text-wire-400">(3.2 km)</span>
              </div>
              <div className="text-wire-600 dark:text-wire-400 text-[11px] truncate">
                Near North Overbridge, MG Road
              </div>
            </div>

            <div>
              <div className="text-wire-500 text-[10px] uppercase font-mono">Reported Issue & Payout</div>
              <div className="font-bold text-wire-900 dark:text-white">
                {pendingRequests[0].services.map((s) => s.name).join(", ")}
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold font-mono text-[11px]">
                Est. Payout: {formatCurrency(pendingRequests[0].laborCharge + 150)} (Visit + Labor)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => updateBookingStatus(pendingRequests[0].id, "declined")}
              className="px-3 py-1.5 border border-wire-300 dark:border-wire-700 text-wire-700 dark:text-wire-300 rounded font-medium text-xs hover:bg-wire-100"
            >
              Decline / Forward
            </button>
            <button
              onClick={() => {
                updateBookingStatus(pendingRequests[0].id, "accepted");
                setMechanicStatus("busy");
              }}
              className="px-5 py-1.5 bg-emerald-700 text-white rounded font-bold text-xs hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Breakdown Call (1-Tap) ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Two-Column Layout: Active / Upcoming Bookings + Latest Reviews */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Active Jobs (8 Cols) */}
        <div className="lg:col-span-8 border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-wire-200 dark:border-wire-800">
            <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-2">
              <span>📅 Active & Scheduled Jobs</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-wire-100 dark:bg-wire-800 text-wire-700 dark:text-wire-300">
                {activeJobs.length} active
              </span>
            </h3>
          </div>

          {activeJobs.length === 0 ? (
            <div className="p-6 text-center text-wire-500 text-xs">
              No active jobs in the workshop queue.
            </div>
          ) : (
            activeJobs.map((b) => (
              <div
                key={b.id}
                className="p-3.5 border border-wire-200 dark:border-wire-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-wire-50/50 dark:bg-wire-850"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                      🚐 ONSITE
                    </span>
                    <span className="font-bold text-wire-900 dark:text-white">
                      {b.vehicle.make} {b.vehicle.model} ({b.vehicle.regNumber})
                    </span>
                    <span className="text-wire-400 font-mono text-[10px]">#{b.bookingNumber}</span>
                  </div>
                  <div className="text-[11px] text-wire-500">
                    Service: {b.services.map((s) => s.name).join(", ")} • Contact: {b.customerPhone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-bold text-[11px]">
                    🔧 In Service
                  </span>
                  <Link
                    href={`/mechanic/log/${b.id}`}
                    className="px-3 py-1 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-medium hover:opacity-90"
                  >
                    Complete & Log ›
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Latest Customer Reviews (4 Cols) */}
        <div className="lg:col-span-4 border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-wire-200 dark:border-wire-800">
            <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-1.5">
              <span>⭐ Recent Reviews</span>
              <span className="text-xs font-mono font-normal text-wire-500">(4.9/5.0)</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded bg-wire-50 dark:bg-wire-850 border border-wire-200 dark:border-wire-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wire-900 dark:text-white">Vehicle Owner (Swift Dzire)</span>
                <span className="text-amber-500 font-bold">★★★★★</span>
              </div>
              <p className="text-[11px] text-wire-600 dark:text-wire-400 italic">
                &ldquo;Mechanic arrived in 18 minutes. Tested alternator, swapped battery, and gave transparent bill.&rdquo;
              </p>
              <div className="text-[10px] text-wire-400 flex justify-between items-center pt-1">
                <span>2 hours ago • Verified Job</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-wire-50 dark:bg-wire-850 border border-wire-200 dark:border-wire-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wire-900 dark:text-white">Vehicle Owner (Classic 350)</span>
                <span className="text-amber-500 font-bold">★★★★★</span>
              </div>
              <p className="text-[11px] text-wire-600 dark:text-wire-400 italic">
                &ldquo;Accurate odometer logging and genuine OEM chain spray used.&rdquo;
              </p>
              <div className="text-[10px] text-wire-400 flex justify-between items-center pt-1">
                <span>Yesterday • Verified Job</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
