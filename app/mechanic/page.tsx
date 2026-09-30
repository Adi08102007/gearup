"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { Wrench, Clock, CheckCircle2, AlertCircle, Phone, ArrowRight, Gauge, Check, X, ShieldCheck } from "lucide-react";

export default function MechanicDashboard() {
  const { bookings, updateBookingStatus, shops } = useApp();
  const currentShop = shops[0]; // Apex Auto Precision & Diagnostics

  // 2-minute timer simulation for pending requests
  const [secondsLeft, setSecondsLeft] = useState(114);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeJobs = bookings.filter((b) => b.status === "accepted" || b.status === "in_progress");
  const readyOrDone = bookings.filter((b) => b.status === "ready_for_pickup" || b.status === "completed");

  return (
    <div className="space-y-8">
      {/* Workshop Header */}
      <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Mechanic Operations Portal</span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Accepting Bookings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentShop.name}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>{currentShop.address}</span>
            <span>•</span>
            <span className="text-slate-300">Hotline: {currentShop.phone}</span>
          </p>
        </div>

        {/* Workshop Quick Stats */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">
              {currentShop.activeBays}/{currentShop.totalBays}
            </div>
            <div className="text-xs text-slate-400">Bays Occupied</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {activeJobs.length}
            </div>
            <div className="text-xs text-slate-400">Vehicles in Bay</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {pendingRequests.length}
            </div>
            <div className="text-xs text-slate-400">New Requests</div>
          </div>
        </div>
      </div>

      {/* Section 1: Incoming Service Bookings with 2-Minute Countdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Incoming Service Requests</h2>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                {pendingRequests.length} pending
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">2-Minute SLA Acceptance Window</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0f1422] border border-slate-800 text-center text-slate-400 text-sm">
            No incoming pending bookings right now. Workshop queue is up to date!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#111728] border border-amber-500/30 shadow-lg shadow-amber-500/5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{b.bookingNumber}</span>
                      <span className="text-xs text-slate-400 font-medium">• {b.scheduledTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {b.vehicle.make} {b.vehicle.model}
                    </h3>
                    <div className="text-xs font-mono text-emerald-400">
                      Plate: {b.vehicle.regNumber} ({b.vehicle.currentKm.toLocaleString()} km)
                    </div>
                  </div>

                  {/* 2-Minute Countdown Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-mono font-bold">{formatTimer(secondsLeft)}</span>
                  </div>
                </div>

                {/* Customer Details & Symptoms */}
                <div className="p-3 bg-slate-900/90 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Contact: {b.customerName} ({b.customerPhone})</span>
                  </div>
                  {b.notes && (
                    <div className="text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      <strong>Customer Note:</strong> &ldquo;{b.notes}&rdquo;
                    </div>
                  )}
                  <div className="text-slate-400">
                    Requested Services:
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {b.services.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {s.name} ({formatCurrency(s.price)})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: 1-Tap Accept or Decline */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => updateBookingStatus(b.id, "accepted")}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept & Assign Bay</span>
                  </button>
                  <button
                    onClick={() => updateBookingStatus(b.id, "declined")}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Active Workshop Repairs & Odometer Logging */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Active Bay Repairs & Inspections</h2>

        <div className="grid grid-cols-1 gap-4">
          {activeJobs.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{b.bookingNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                      Bay #2 Assigned
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {b.vehicle.make} {b.vehicle.model} ({b.vehicle.regNumber})
                  </h3>
                  <p className="text-xs text-slate-400">Owner Contact: {b.customerPhone}</p>
                </div>

                {/* Status Stepper Actions */}
                <div className="flex items-center gap-2">
                  {b.status === "accepted" && (
                    <button
                      onClick={() => updateBookingStatus(b.id, "in_progress")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      Start Teardown & Inspection
                    </button>
                  )}

                  {b.status === "in_progress" && (
                    <Link
                      href={`/mechanic/log/${b.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Gauge className="w-4 h-4" />
                      <span>Log Service & Odometer</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* 4-Stage Repair Stepper Indicator */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { key: "accepted", label: "1. Intake" },
                  { key: "in_progress", label: "2. In Progress" },
                  { key: "ready_for_pickup", label: "3. QA & Ready" },
                  { key: "completed", label: "4. Handover Done" },
                ].map((step, idx) => {
                  const stepIndex = ["accepted", "in_progress", "ready_for_pickup", "completed"].indexOf(b.status);
                  const isDone = idx <= stepIndex;
                  return (
                    <div
                      key={step.key}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        isDone
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-slate-900 border-slate-800 text-slate-500"
                      }`}
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>

              {/* Service checklist */}
              <div className="p-3 bg-slate-900/60 rounded-xl flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400">Assigned Services:</span>
                {b.services.map((s) => (
                  <span key={s.id} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Completed / Ready for Pickup */}
      {readyOrDone.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Completed & Invoiced Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyOrDone.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{b.bookingNumber}</span>
                    <h4 className="font-bold text-white text-base">
                      {b.vehicle.make} {b.vehicle.model} ({b.vehicle.regNumber})
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {b.status === "ready_for_pickup" ? "Ready for Customer" : "Handover Completed"}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-400">
                  <div>Odometer Logged: <strong className="text-white font-mono">{b.loggedOdometer?.toLocaleString()} km</strong></div>
                  <div>Customer OTP required at pickup: <strong className="text-emerald-400 font-mono">{b.completionOtp}</strong></div>
                </div>

                {b.status === "ready_for_pickup" && (
                  <button
                    onClick={() => updateBookingStatus(b.id, "completed")}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg transition-all"
                  >
                    Confirm Handover & Settle Bill
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
