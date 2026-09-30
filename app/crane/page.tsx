"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { Truck, Navigation, Camera, ShieldCheck, MapPin, CheckCircle, Clock, Phone, AlertTriangle, Key } from "lucide-react";
import { CraneTowDispatch } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

function CraneFleetDashboardContent() {
  const { towDispatches, updateTowStatus, toggleTowPhoto, verifyTowOtp } = useApp();
  const [dutyStatus, setDutyStatus] = useState<"available" | "towing" | "offduty">("available");
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});

  // 1:45 countdown timer
  const [secondsLeft, setSecondsLeft] = useState(105);

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

  const activeDispatches = towDispatches.filter((t) => t.status !== "completed");
  const completedDispatches = towDispatches.filter((t) => t.status === "completed");

  const stages: { key: CraneTowDispatch["status"]; label: string }[] = [
    { key: "dispatched", label: "1. Accepted" },
    { key: "arrived", label: "2. En Route" },
    { key: "loaded", label: "3. Loaded / Hooked" },
    { key: "handover_pending", label: "4. In Transit" },
    { key: "completed", label: "5. Delivered" },
  ];

  const handleNextStage = (t: CraneTowDispatch) => {
    const stageOrder: CraneTowDispatch["status"][] = ["dispatched", "arrived", "loaded", "handover_pending"];
    const curIdx = stageOrder.indexOf(t.status);
    if (curIdx !== -1 && curIdx < stageOrder.length - 1) {
      updateTowStatus(t.id, stageOrder[curIdx + 1]);
    }
  };

  const handleOtpSubmit = (dispatchId: string) => {
    const input = otpInputs[dispatchId] || "";
    const success = verifyTowOtp(dispatchId, input);
    if (!success) {
      setOtpError((prev) => ({ ...prev, [dispatchId]: "Invalid OTP code. Please check with customer or receiving garage." }));
    } else {
      setOtpError((prev) => ({ ...prev, [dispatchId]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header: Welcome + Big Duty Switch (Matches Crane Wireframe 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-wire-50 dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-4 md:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-wire-900 dark:text-white">
              Tow Dispatch Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              ON-DUTY
            </span>
          </div>
          <p className="text-xs text-wire-500">
            Unit: <strong>Flatbed #1 (KL-07-EE-9090)</strong> • GPS Radar: <strong>40 km active</strong>
          </p>
        </div>

        {/* Big Visual Duty Switch */}
        <button
          onClick={() =>
            setDutyStatus((prev) =>
              prev === "available" ? "towing" : prev === "towing" ? "offduty" : "available"
            )
          }
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition ${
            dutyStatus === "available"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : dutyStatus === "towing"
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-wire-700 text-white"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>
            {dutyStatus === "available"
              ? "ON-DUTY & BROADCASTING"
              : dutyStatus === "towing"
              ? "TOWING IN TRANSIT"
              : "OFF-DUTY (PAUSED)"}
          </span>
        </button>
      </div>

      {/* 2. 4 Metrics: New Requests, Active Tows, Towed Today, Earnings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="text-xs font-medium text-wire-500">New Tow Requests</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-wire-900 dark:text-white">1</span>
            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1 rounded">
              {formatTimer(secondsLeft)} left
            </span>
          </div>
          <div className="text-[10px] text-wire-500 mt-1">Stranded on Bypass Highway</div>
        </div>

        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="text-xs font-medium text-wire-500">Active Recovery Job</div>
          <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
            {activeDispatches.length}
          </div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">Stage 3: Loaded on Flatbed</div>
        </div>

        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="text-xs font-medium text-wire-500">Vehicles Towed Today</div>
          <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">3</div>
          <div className="text-[10px] text-wire-500 mt-1">Total transit: 48.5 km</div>
        </div>

        <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-900">
          <div className="text-xs font-medium text-wire-500">Today&apos;s Tow Revenue</div>
          <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">₹5,400</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">+₹320 toll reimbursement</div>
        </div>
      </div>

      {/* 3. Urgent Incoming Tow Dispatch Card */}
      {activeDispatches.length > 0 && (
        <div className="border-2 border-red-500/80 rounded-xl p-4 bg-red-50/30 dark:bg-red-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase animate-pulse">
                🚨 HIGHWAY BREAKDOWN TOW DISPATCH
              </span>
              <span className="text-xs font-bold text-wire-900 dark:text-white">
                Pickup 5.4 km away
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-red-700 bg-white dark:bg-wire-900 px-2 py-0.5 rounded border border-red-300">
              {formatTimer(secondsLeft)}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-2 text-xs bg-white dark:bg-wire-900 p-3 rounded-lg border border-red-200">
            <div>
              <div className="text-[10px] text-wire-400 font-mono">STRANDED VEHICLE</div>
              <div className="font-bold text-wire-900 dark:text-white">
                {activeDispatches[0].vehicleInfo.make} {activeDispatches[0].vehicleInfo.model}
              </div>
              <div className="text-wire-500 font-mono text-[11px]">
                Condition: {activeDispatches[0].vehicleInfo.condition.replace(/_/g, " ")}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-wire-400 font-mono">PICKUP POINT (GPS)</div>
              <div className="font-bold text-wire-900 dark:text-white">
                {activeDispatches[0].pickupAddress}
              </div>
              <div className="text-wire-500 text-[11px]">Stranded on left shoulder</div>
            </div>

            <div>
              <div className="text-[10px] text-wire-400 font-mono">DROP-OFF DESTINATION</div>
              <div className="font-bold text-wire-900 dark:text-white">
                {activeDispatches[0].destinationShopName}
              </div>
              <div className="text-wire-500 text-[11px]">
                Tow distance: <strong>{activeDispatches[0].distanceKm} km</strong>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-wire-400 font-mono">GUARANTEED FARE</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm font-mono">
                {formatCurrency(activeDispatches[0].totalFare)}
              </div>
              <div className="text-[10px] text-wire-500">
                Base ₹{activeDispatches[0].baseFare} + ₹{activeDispatches[0].perKmRate}/km
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Recovery Job (5-Stage Recovery Stepper + 4-Point Photo Inspection) */}
      <div className="space-y-4">
        {activeDispatches.map((t) => (
          <div
            key={t.id}
            className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-900 space-y-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-wire-200 dark:border-wire-800">
              <div>
                <h3 className="font-bold text-sm text-wire-900 dark:text-white">
                  Active Recovery #{t.dispatchNumber}
                </h3>
                <p className="text-xs text-wire-500">
                  {t.vehicleInfo.make} {t.vehicleInfo.model} ({t.vehicleInfo.regNumber}) • Destination: {t.destinationShopName}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${t.customerPhone}`}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold flex items-center gap-1 hover:bg-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Motorist</span>
                </a>
              </div>
            </div>

            {/* 5-Stage Stepper */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-wire-900 dark:text-white flex justify-between">
                <span>Towing Progression Lifecycle</span>
                <span className="text-amber-600 font-mono text-[11px]">
                  Stage: {t.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {stages.map((stage, idx) => {
                  const stageKeys: CraneTowDispatch["status"][] = ["dispatched", "arrived", "loaded", "handover_pending", "completed"];
                  const curIdx = stageKeys.indexOf(t.status);
                  const isDone = idx <= curIdx;
                  const isCurrent = idx === curIdx;

                  return (
                    <div
                      key={stage.key}
                      className={`p-2 rounded-lg font-bold transition ${
                        isCurrent
                          ? "bg-amber-500 text-white shadow"
                          : isDone
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200"
                          : "bg-wire-100 dark:bg-wire-800 text-wire-400"
                      }`}
                    >
                      {stage.label}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-between items-center pt-3 border-t border-wire-200 dark:border-wire-800 gap-2">
                <div className="text-[11px] text-wire-500">Customer is tracking your recovery truck on live GPS.</div>
                {t.status !== "handover_pending" ? (
                  <button
                    onClick={() => handleNextStage(t)}
                    className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs hover:opacity-90"
                  >
                    Advance Recovery Stage ➔
                  </button>
                ) : (
                  /* OTP Handover Verification */
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="4-digit OTP"
                      value={otpInputs[t.id] || ""}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [t.id]: e.target.value })}
                      className="border border-wire-400 rounded px-2.5 py-1 text-xs font-mono w-28 text-center bg-transparent"
                    />
                    <button
                      onClick={() => handleOtpSubmit(t.id)}
                      className="px-4 py-1.5 bg-emerald-700 text-white rounded font-bold text-xs hover:bg-emerald-800"
                    >
                      Verify Handover & Release Payout
                    </button>
                    <span className="text-[10px] text-wire-400">Hint: {t.handoverOtp}</span>
                  </div>
                )}
              </div>
              {otpError[t.id] && <p className="text-xs text-red-500">{otpError[t.id]}</p>}
            </div>

            {/* Pre-Tow 4-Point Photo Inspection */}
            <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 text-xs">
              <div className="font-bold text-wire-900 dark:text-white flex items-center justify-between">
                <span>Pre-Hookup Inspection & Damage Documentation</span>
                <span className="text-[11px] text-wire-500">Tap to toggle verified photo upload</span>
              </div>
              <p className="text-wire-500 text-[11px]">
                Take 4 photos before winching onto flatbed to protect operator against existing scratch/dents.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["front", "rear", "left", "right"] as const).map((angle) => {
                  const isCaptured = t.photos[angle];
                  return (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => toggleTowPhoto(t.id, angle)}
                      className={`border border-dashed rounded-lg p-3 text-center transition ${
                        isCaptured
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-wire-50 dark:bg-wire-850 border-wire-300 text-wire-500 hover:border-wire-500"
                      }`}
                    >
                      <div className="text-base mb-1">📸</div>
                      <div className="font-bold text-[11px] capitalize">{angle} View</div>
                      <span className="text-[10px]">
                        {isCaptured ? "✓ Photo Verified" : "Tap to Upload"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CraneFleetDashboard() {
  return (
    <AuthGuard allowedRoles={["crane", "mechanic"]}>
      <CraneFleetDashboardContent />
    </AuthGuard>
  );
}
