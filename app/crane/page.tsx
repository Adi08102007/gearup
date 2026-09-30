"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { Truck, Navigation, Camera, ShieldCheck, MapPin, CheckCircle, Clock, Phone, AlertTriangle, Key } from "lucide-react";
import { CraneTowDispatch } from "@/lib/types";

export default function CraneFleetDashboard() {
  const { towDispatches, updateTowStatus, toggleTowPhoto, verifyTowOtp } = useApp();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});

  const activeDispatches = towDispatches.filter((t) => t.status !== "completed");
  const completedDispatches = towDispatches.filter((t) => t.status === "completed");

  const stages: { key: CraneTowDispatch["status"]; label: string }[] = [
    { key: "dispatched", label: "1. Mobilized" },
    { key: "arrived", label: "2. Arrived On-Site" },
    { key: "loaded", label: "3. Flatbed Secured" },
    { key: "handover_pending", label: "4. Shop Drop-Off" },
    { key: "completed", label: "5. OTP Handover" },
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
      setOtpError((prev) => ({ ...prev, [dispatchId]: "Invalid OTP code. Check with customer." }));
    } else {
      setOtpError((prev) => ({ ...prev, [dispatchId]: "" }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Fleet Operations Header */}
      <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Recovery Fleet Command</span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Heavy Recovery Dispatch Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">24/7 Highway Crane & Flatbed Fleet</h1>
          <p className="text-xs text-slate-400">
            Regulated ₹1,500 Base + ₹65/km Tariff • Pre-Tow 4-Point Photo Inspection System
          </p>
        </div>

        {/* Fleet Quick Status */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">3/4</div>
            <div className="text-xs text-slate-400">Trucks Active</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {activeDispatches.length}
            </div>
            <div className="text-xs text-slate-400">Live Dispatches</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 font-mono">
              {completedDispatches.length}
            </div>
            <div className="text-xs text-slate-400">Completed Tows</div>
          </div>
        </div>
      </div>

      {/* Active Dispatches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Active Highway Tow Dispatches</span>
          </h2>
          <span className="text-xs text-slate-500">{activeDispatches.length} mission(s) running</span>
        </div>

        {activeDispatches.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0f1422] border border-slate-800 text-center text-slate-400 text-sm">
            All assigned tow missions are completed. Standby for next highway emergency.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeDispatches.map((t) => {
              const allPhotosTaken = t.photos.front && t.photos.rear && t.photos.left && t.photos.right;
              return (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-6 shadow-xl"
                >
                  {/* Top Bar: Mission, Vehicle, Rate */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {t.dispatchNumber}
                        </span>
                        <span className="text-xs text-slate-400">Unit: <strong>{t.driverName}</strong> ({t.truckPlate})</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {t.vehicleInfo.make} {t.vehicleInfo.model}
                      </h3>
                      <div className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{t.vehicleInfo.regNumber}</span>
                        <span>•</span>
                        <span className="text-red-400 font-semibold uppercase">Condition: {t.vehicleInfo.condition.replace(/_/g, " ")}</span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                      <div className="text-xs text-slate-400">Calculated Tow Fare</div>
                      <div className="text-2xl font-bold text-amber-400 font-mono">
                        {formatCurrency(t.totalFare)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {t.distanceKm} km (₹{t.baseFare} base + ₹{t.perKmRate}/km)
                      </div>
                    </div>
                  </div>

                  {/* 5-Stage Stepper Component */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Recovery Workflow Stage:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {stages.map((stage, idx) => {
                        const stageKeys: CraneTowDispatch["status"][] = ["dispatched", "arrived", "loaded", "handover_pending", "completed"];
                        const curIdx = stageKeys.indexOf(t.status);
                        const isDone = idx <= curIdx;
                        const isCurrent = idx === curIdx;

                        return (
                          <div
                            key={stage.key}
                            className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                              isCurrent
                                ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-sm ring-1 ring-amber-500/20"
                                : isDone
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-slate-900 border-slate-800 text-slate-500"
                            }`}
                          >
                            {stage.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Route & Destination Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span className="font-semibold text-slate-200">Pickup Breakdown Site:</span>
                      </div>
                      <p className="text-slate-300 pl-5">{t.pickupAddress}</p>
                      <div className="pl-5 text-slate-400">Caller: {t.customerPhone}</div>
                    </div>

                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-slate-200">Drop-off Workshop:</span>
                      </div>
                      <p className="text-slate-300 pl-5 font-bold">{t.destinationShopName}</p>
                      <p className="text-slate-400 pl-5">{t.destinationAddress}</p>
                    </div>
                  </div>

                  {/* 4-Point Damage Photo Capture Checklist */}
                  <div className="space-y-2 p-4 rounded-xl bg-[#141b2d] border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-blue-400" />
                        <span>Pre-Tow 4-Point Damage Inspection (Liability Protection)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {allPhotosTaken ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> All 4 angles documented
                          </span>
                        ) : (
                          "Tap to toggle verified photo upload"
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {(["front", "rear", "left", "right"] as const).map((angle) => {
                        const isCaptured = t.photos[angle];
                        return (
                          <button
                            key={angle}
                            type="button"
                            onClick={() => toggleTowPhoto(t.id, angle)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                              isCaptured
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <span className="capitalize">{angle} View</span>
                            {isCaptured ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Camera className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Step Controls & Secure Handover OTP */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                    {t.status !== "handover_pending" ? (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleNextStage(t)}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md shadow-amber-600/20"
                        >
                          Advance to Next Recovery Stage
                        </button>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          Updates customer & receiving garage in real time
                        </span>
                      </div>
                    ) : (
                      /* OTP Confirmation Form */
                      <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-purple-400" />
                            <span>Verify Customer / Garage Handover OTP:</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit OTP"
                              value={otpInputs[t.id] || ""}
                              onChange={(e) => setOtpInputs({ ...otpInputs, [t.id]: e.target.value })}
                              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 w-36 outline-none font-mono focus:border-purple-500"
                            />
                            <button
                              onClick={() => handleOtpSubmit(t.id)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all"
                            >
                              Verify & Settle Tow
                            </button>
                            <span className="text-[11px] text-slate-500">Hint: {t.handoverOtp}</span>
                          </div>
                          {otpError[t.id] && <p className="text-xs text-red-400">{otpError[t.id]}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Tows Log */}
      {completedDispatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Archived Tow Deliveries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedDispatches.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">{t.dispatchNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Successfully Delivered
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {t.vehicleInfo.make} {t.vehicleInfo.model} ({t.vehicleInfo.regNumber})
                </h4>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Delivered to: {t.destinationShopName}</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(t.totalFare)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
