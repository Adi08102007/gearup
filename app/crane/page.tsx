"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import {
  Truck,
  Navigation,
  Camera,
  ShieldCheck,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  AlertTriangle,
  Key,
  DollarSign,
  FileText,
  Star,
  Settings,
  Sliders,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  RefreshCw,
  X,
  CreditCard,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";
import { CraneTowDispatch } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

type CraneTab =
  | "dashboard"
  | "requests"
  | "active"
  | "handover"
  | "rates"
  | "trips"
  | "reviews"
  | "earnings"
  | "truck";

function CraneFleetDashboardContent() {
  const {
    towDispatches,
    updateTowStatus,
    toggleTowPhoto,
    verifyTowOtp,
    addTowToll,
    cancelTowDispatch,
    simulateIncomingTow,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CraneTab>("dashboard");
  const [dutyStatus, setDutyStatus] = useState<"available" | "towing" | "offduty">("available");
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});
  const [tollInput, setTollInput] = useState<string>("120");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rate & Radius Settings state
  const [ratesConfig, setRatesConfig] = useState({
    baseFare: 1500,
    perKmRate: 65,
    nightSurcharge: true,
    dispatchRadiusKm: 40,
    truckType: "Hydraulic Rollback Flatbed (3.5T)",
  });

  // Payout withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  // Selected Active Job ID
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // 1:45 countdown timer for incoming requests
  const [secondsLeft, setSecondsLeft] = useState(105);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 105));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter Dispatches
  const pendingRequests = towDispatches.filter((t) => t.status === "searching" || t.status === "dispatched");
  const activeTows = towDispatches.filter(
    (t) => t.status === "en_route" || t.status === "arrived" || t.status === "loaded" || t.status === "handover_pending"
  );
  const completedTows = towDispatches.filter((t) => t.status === "completed");

  // Current primary active job
  const activeJob =
    towDispatches.find((t) => t.id === selectedJobId) ||
    activeTows[0] ||
    pendingRequests[0] ||
    null;

  // Stages definition
  const stages: { key: CraneTowDispatch["status"]; label: string; desc: string }[] = [
    { key: "dispatched", label: "1. Accepted", desc: "Dispatch confirmed" },
    { key: "en_route", label: "2. En Route", desc: "Driving to motorist GPS" },
    { key: "arrived", label: "3. Arrived", desc: "At breakdown spot" },
    { key: "loaded", label: "4. Loaded & Strapped", desc: "Pre-tow photos verified" },
    { key: "handover_pending", label: "5. In Transit", desc: "Transporting to garage" },
    { key: "completed", label: "6. Delivered", desc: "Garage OTP validated" },
  ];

  const handleNextStage = (t: CraneTowDispatch) => {
    const stageOrder: CraneTowDispatch["status"][] = [
      "dispatched",
      "en_route",
      "arrived",
      "loaded",
      "handover_pending",
    ];
    const curIdx = stageOrder.indexOf(t.status);
    if (curIdx !== -1 && curIdx < stageOrder.length - 1) {
      const nextStatus = stageOrder[curIdx + 1];
      updateTowStatus(t.id, nextStatus);
      showToast(`Stage updated to: ${nextStatus.replace("_", " ").toUpperCase()}`);
    } else if (t.status === "handover_pending") {
      setActiveTab("handover");
    }
  };

  const handleAcceptRequest = (t: CraneTowDispatch) => {
    updateTowStatus(t.id, "en_route");
    setSelectedJobId(t.id);
    setDutyStatus("towing");
    setActiveTab("active");
    showToast(`✅ Tow request accepted for ${t.vehicleInfo.make} ${t.vehicleInfo.model}!`);
  };

  const handleRejectRequest = (dispatchId: string) => {
    cancelTowDispatch(dispatchId);
    showToast("Request passed to next available regional tow unit.");
  };

  const handleOtpSubmit = (dispatchId: string) => {
    const input = otpInputs[dispatchId] || "";
    const success = verifyTowOtp(dispatchId, input);
    if (!success) {
      setOtpError((prev) => ({
        ...prev,
        [dispatchId]: "Invalid OTP code. Please check with receiving garage bay manager.",
      }));
    } else {
      setOtpError((prev) => ({ ...prev, [dispatchId]: "" }));
      setDutyStatus("available");
      showToast("🎉 Handover OTP verified! Certified trip receipt generated & payout released to wallet.");
    }
  };

  const handleAddToll = (dispatchId: string) => {
    const amt = parseInt(tollInput, 10);
    if (!isNaN(amt) && amt > 0) {
      addTowToll(dispatchId, amt);
      showToast(`₹${amt} highway FASTag toll added to bill!`);
      setTollInput("");
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    setIsWithdrawing(true);
    setTimeout(() => {
      setWithdrawnTotal((prev) => prev + amt);
      setIsWithdrawing(false);
      setWithdrawAmount("");
      showToast(`💸 ₹${amt.toLocaleString()} successfully transferred to linked Bank Account!`);
    }, 600);
  };

  // Earnings calculations
  const totalCompletedFare = completedTows.reduce((sum, t) => sum + t.totalFare, 0);
  const totalTollsClaimed = completedTows.reduce((sum, t) => sum + (t.tollAmount || 0), 0);
  const walletBalance = 5400 + totalCompletedFare - withdrawnTotal;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-wire-900 text-white dark:bg-white dark:text-wire-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 border border-wire-700 animate-in fade-in slide-in-from-bottom-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header: Welcome + Big Duty Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-wire-850 border border-wire-300 dark:border-wire-700 rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-xs font-mono font-bold">
              🏗️ CRANE OPS
            </span>
            <h1 className="text-lg md:text-xl font-bold text-wire-900 dark:text-white">
              Tow Dispatch Terminal
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dutyStatus === "available"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                  : dutyStatus === "towing"
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                  : "bg-wire-200 dark:bg-wire-800 text-wire-600 dark:text-wire-400"
              }`}
            >
              {dutyStatus === "available" ? "ON-DUTY" : dutyStatus === "towing" ? "TOWING" : "OFF-DUTY"}
            </span>
          </div>
          <p className="text-xs text-wire-500 mt-1">
            Unit: <strong>Flatbed #1 (KL-07-EE-9090)</strong> • GPS Radar:{" "}
            <strong>{ratesConfig.dispatchRadiusKm} km active</strong> • Base: <strong>₹{ratesConfig.baseFare}</strong>
          </p>
        </div>

        {/* Action Controls & Big Status Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              simulateIncomingTow();
              setActiveTab("requests");
              showToast("🚨 Incoming simulated highway breakdown request received!");
            }}
            className="px-3 py-1.5 border border-red-300 dark:border-red-800 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <span>🚨</span>
            <span>Simulate Request</span>
          </button>

          {/* Duty Switcher Group */}
          <div className="flex items-center bg-wire-100 dark:bg-wire-800 p-0.5 rounded-lg border border-wire-300 dark:border-wire-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setDutyStatus("available");
                showToast("Duty set to: Online & Available");
              }}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                dutyStatus === "available"
                  ? "bg-white dark:bg-wire-700 shadow-sm text-emerald-700 dark:text-emerald-400 font-bold"
                  : "text-wire-600 dark:text-wire-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDutyStatus("towing");
                showToast("Duty set to: Towing in Transit");
              }}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                dutyStatus === "towing"
                  ? "bg-white dark:bg-wire-700 shadow-sm text-amber-700 dark:text-amber-300 font-bold"
                  : "text-wire-600 dark:text-wire-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Towing</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDutyStatus("offduty");
                showToast("Duty set to: Off-Duty (Paused)");
              }}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                dutyStatus === "offduty"
                  ? "bg-white dark:bg-wire-700 shadow-sm text-wire-900 dark:text-white font-bold"
                  : "text-wire-600 dark:text-wire-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-wire-400"></span>
              <span>Off-Duty</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-wire-300 dark:border-wire-700 overflow-x-auto no-scrollbar pb-2 text-xs">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "dashboard"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>📊</span>
          <span>Fleet Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "requests"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>🚨</span>
          <span>Tow Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "active"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>📍</span>
          <span>Active Recovery</span>
          {activeTows.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("handover")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "handover"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>📋</span>
          <span>Complete Handover</span>
        </button>

        <button
          onClick={() => setActiveTab("rates")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "rates"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>🏷️</span>
          <span>Rates & Radius</span>
        </button>

        <button
          onClick={() => setActiveTab("trips")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "trips"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>📄</span>
          <span>Trip Logs ({completedTows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "earnings"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>💰</span>
          <span>Earnings & Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "reviews"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>⭐</span>
          <span>Reviews (4.9)</span>
        </button>

        <button
          onClick={() => setActiveTab("truck")}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "truck"
              ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
              : "text-wire-600 hover:text-wire-900 dark:text-wire-300 hover:bg-wire-100 dark:hover:bg-wire-800"
          }`}
        >
          <span>🚛</span>
          <span>Truck & Permits</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FLEET OVERVIEW DASHBOARD                                           */}
      {/* ========================================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* 4 Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div
              onClick={() => setActiveTab("requests")}
              className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer transition space-y-1"
            >
              <div className="text-xs font-medium text-wire-500 flex items-center justify-between">
                <span>Incoming Requests</span>
                <span className="text-[10px] text-red-600 font-mono font-bold bg-red-50 dark:bg-red-950 px-1 rounded">
                  {formatTimer(secondsLeft)}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
                {pendingRequests.length}
              </div>
              <div className="text-[11px] text-wire-500">
                {pendingRequests.length > 0 ? "Awaiting 1-tap accept" : "Standing by on highway radar"}
              </div>
            </div>

            <div
              onClick={() => setActiveTab("active")}
              className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer transition space-y-1"
            >
              <div className="text-xs font-medium text-wire-500">Active Recovery Jobs</div>
              <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
                {activeTows.length}
              </div>
              <div className="text-[11px] text-amber-600 font-bold">
                {activeTows.length > 0 ? `${activeTows[0].status.replace("_", " ").toUpperCase()}` : "Ready for next job"}
              </div>
            </div>

            <div
              onClick={() => setActiveTab("trips")}
              className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer transition space-y-1"
            >
              <div className="text-xs font-medium text-wire-500">Completed Tows</div>
              <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
                {completedTows.length + 3}
              </div>
              <div className="text-[11px] text-wire-500 font-mono">Total transit: 48.5 km</div>
            </div>

            <div
              onClick={() => setActiveTab("earnings")}
              className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer transition space-y-1"
            >
              <div className="text-xs font-medium text-wire-500">Wallet Available</div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                ₹{walletBalance.toLocaleString()}
              </div>
              <div className="text-[11px] text-wire-500 font-mono">+₹{totalTollsClaimed + 320} toll claims</div>
            </div>
          </div>

          {/* Quick Active Dispatch Alert Strip if active tow exists */}
          {activeTows.length > 0 && (
            <div className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <div className="font-bold text-wire-900 dark:text-white">
                    TOWING IN TRANSIT: {activeTows[0].vehicleInfo.make} {activeTows[0].vehicleInfo.model} ({activeTows[0].vehicleInfo.regNumber})
                  </div>
                  <div className="text-wire-600 dark:text-wire-400">
                    Pickup: {activeTows[0].pickupAddress} ➔ Destination: {activeTows[0].destinationShopName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedJobId(activeTows[0].id);
                  setActiveTab("active");
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold uppercase tracking-wider text-xs whitespace-nowrap shadow-sm"
              >
                Open Active Recovery Job ➔
              </button>
            </div>
          )}

          {/* Incoming Request Quick Preview Card */}
          {pendingRequests.length > 0 ? (
            <div className="border-2 border-red-500/80 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-wire-200 dark:border-wire-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase animate-pulse">
                    🚨 EMERGENCY HIGHWAY DISPATCH
                  </span>
                  <span className="text-xs font-bold text-wire-900 dark:text-white">
                    {pendingRequests[0].vehicleInfo.make} {pendingRequests[0].vehicleInfo.model}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-1 rounded border border-red-300 dark:border-red-800">
                  ⏱️ Respond in: {formatTimer(secondsLeft)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg">
                  <div className="text-[10px] font-mono text-wire-400 uppercase">Immobilized Vehicle</div>
                  <div className="font-bold text-wire-900 dark:text-white mt-0.5">
                    {pendingRequests[0].vehicleInfo.make} {pendingRequests[0].vehicleInfo.model}
                  </div>
                  <div className="text-wire-500 font-mono text-[11px]">
                    Plate: {pendingRequests[0].vehicleInfo.regNumber}
                  </div>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded uppercase">
                    {pendingRequests[0].vehicleInfo.condition.replace("_", " ")}
                  </span>
                </div>

                <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg">
                  <div className="text-[10px] font-mono text-wire-400 uppercase">Pickup Location</div>
                  <div className="font-bold text-wire-900 dark:text-white mt-0.5">
                    {pendingRequests[0].pickupAddress}
                  </div>
                  <div className="text-wire-500 text-[11px] mt-0.5">~5.4 km from your unit</div>
                </div>

                <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg">
                  <div className="text-[10px] font-mono text-wire-400 uppercase">Drop-Off Garage</div>
                  <div className="font-bold text-wire-900 dark:text-white mt-0.5">
                    {pendingRequests[0].destinationShopName}
                  </div>
                  <div className="text-wire-500 text-[11px] mt-0.5">
                    Transit: {pendingRequests[0].distanceKm} km
                  </div>
                </div>

                <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg">
                  <div className="text-[10px] font-mono text-wire-400 uppercase">Guaranteed Fare</div>
                  <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
                    {formatCurrency(pendingRequests[0].totalFare)}
                  </div>
                  <div className="text-wire-400 text-[10px]">
                    ₹{pendingRequests[0].baseFare} base + ₹{pendingRequests[0].perKmRate}/km
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-wire-200 dark:border-wire-800">
                <span className="text-[11px] text-wire-500">
                  ⚠️ Auto-reassigns to secondary fleet unit if timer expires.
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleRejectRequest(pendingRequests[0].id)}
                    className="flex-1 sm:flex-none px-4 py-2 border border-wire-400 rounded-lg text-xs font-bold text-wire-700 dark:text-wire-300 hover:bg-wire-100"
                  >
                    Pass / Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptRequest(pendingRequests[0])}
                    className="flex-1 sm:flex-none px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Accept Tow (1-Tap) ➔</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-wire-300 dark:border-wire-700 rounded-xl p-8 bg-white dark:bg-wire-850 text-center space-y-3">
              <Truck className="w-10 h-10 mx-auto text-wire-400" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-wire-900 dark:text-white">
                  Radar Active • No Incoming Requests
                </h3>
                <p className="text-xs text-wire-500 max-w-md mx-auto">
                  Your flatbed truck is broadcasting on regional Highway NH 66 bypass. Breakdown alerts from motorists and garages appear here instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  simulateIncomingTow();
                  setActiveTab("requests");
                  showToast("Simulated incoming highway breakdown order generated!");
                }}
                className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm"
              >
                + Generate Simulated Breakdown Order
              </button>
            </div>
          )}

          {/* Quick Operations Board Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div
              onClick={() => setActiveTab("rates")}
              className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer space-y-1"
            >
              <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                <span>🏷️</span>
                <span>Rates & Tow Radius</span>
              </div>
              <p className="text-wire-500 text-[11px]">
                Adjust base hookup rates, distance per-km charges, and night standby radius.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("handover")}
              className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer space-y-1"
            >
              <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                <span>📋</span>
                <span>Handover & OTP Release</span>
              </div>
              <p className="text-wire-500 text-[11px]">
                Enter garage receiver OTP and submit FASTag toll claims for instant payout.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("truck")}
              className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 cursor-pointer space-y-1"
            >
              <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                <span>🚛</span>
                <span>Truck & RTO Permits</span>
              </div>
              <p className="text-wire-500 text-[11px]">
                Manage commercial carrier fitness certificates, winch load tests, and permits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INCOMING TOW REQUESTS                                              */}
      {/* ========================================================================= */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-wire-300 dark:border-wire-700 pb-3">
            <div>
              <h2 className="text-base font-bold text-wire-900 dark:text-white">
                Incoming Roadside Breakdown Requests
              </h2>
              <p className="text-xs text-wire-500">
                Real-time roadside emergency calls matched to your current GPS radius ({ratesConfig.dispatchRadiusKm} km).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                simulateIncomingTow();
                showToast("Simulated request broadcasted!");
              }}
              className="px-3 py-1.5 bg-wire-100 hover:bg-wire-200 dark:bg-wire-800 text-wire-900 dark:text-white text-xs font-bold rounded-lg border border-wire-300"
            >
              + Add Mock Request
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="border border-dashed border-wire-300 dark:border-wire-700 rounded-xl p-12 bg-white dark:bg-wire-850 text-center space-y-3">
              <Clock className="w-10 h-10 mx-auto text-wire-400" />
              <h3 className="font-bold text-wire-900 dark:text-white text-sm">
                No Pending Dispatch Requests
              </h3>
              <p className="text-xs text-wire-500 max-w-sm mx-auto">
                No active roadside breakdown orders nearby right now. You are set to <strong>ON-DUTY</strong> and will receive the next broadcast.
              </p>
              <button
                type="button"
                onClick={() => simulateIncomingTow()}
                className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 text-xs font-bold rounded-lg"
              >
                Simulate Incoming Breakdown Call
              </button>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="border-2 border-red-500/80 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-wire-200 dark:border-wire-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase animate-pulse">
                      🚨 URGENT TOW DISPATCH
                    </span>
                    <span className="font-mono text-xs font-bold text-wire-900 dark:text-white">
                      #{req.dispatchNumber}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-1 rounded border border-red-300">
                    ⏱️ Auto-Pass in: {formatTimer(secondsLeft)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-wire-400 uppercase">Stranded Vehicle</span>
                    <div className="font-bold text-wire-900 dark:text-white">
                      {req.vehicleInfo.make} {req.vehicleInfo.model}
                    </div>
                    <div className="text-wire-500 font-mono text-[11px]">{req.vehicleInfo.regNumber}</div>
                    <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded uppercase">
                      Condition: {req.vehicleInfo.condition.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-wire-400 uppercase">Breakdown Spot</span>
                    <div className="font-bold text-wire-900 dark:text-white">{req.pickupAddress}</div>
                    <div className="text-wire-500 text-[11px]">GPS auto-located</div>
                  </div>

                  <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-wire-400 uppercase">Drop-Off Garage</span>
                    <div className="font-bold text-wire-900 dark:text-white">{req.destinationShopName}</div>
                    <div className="text-wire-500 text-[11px]">{req.destinationAddress}</div>
                  </div>

                  <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-wire-400 uppercase">Payout Guarantee</span>
                    <div className="text-lg font-bold font-mono text-emerald-600">
                      {formatCurrency(req.totalFare)}
                    </div>
                    <div className="text-wire-400 text-[10px]">
                      {req.distanceKm} km • Base ₹{req.baseFare} + ₹{req.perKmRate}/km
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-wire-200 dark:border-wire-800">
                  <span className="text-xs text-wire-500">
                    Direct phone dispatch available once 1-tap accept is confirmed.
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(req.id)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-wire-400 rounded-lg text-xs font-bold text-wire-700 dark:text-wire-300 hover:bg-wire-100"
                    >
                      Decline / Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req)}
                      className="flex-1 sm:flex-none px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Accept Tow (1-Tap) ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVE RECOVERY JOB (5-Stage Stepper & Pre-Tow 4-Point Photos)     */}
      {/* ========================================================================= */}
      {activeTab === "active" && (
        <div className="space-y-6">
          {!activeJob || activeJob.status === "completed" ? (
            <div className="border border-dashed border-wire-300 dark:border-wire-700 rounded-xl p-12 bg-white dark:bg-wire-850 text-center space-y-3">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-600" />
              <h3 className="font-bold text-wire-900 dark:text-white text-sm">
                No Active Recovery In Progress
              </h3>
              <p className="text-xs text-wire-500 max-w-sm mx-auto">
                All assigned vehicles have been delivered and verified via garage OTP. Accept a new job from the Incoming Requests tab.
              </p>
              <button
                type="button"
                onClick={() => {
                  simulateIncomingTow();
                  setActiveTab("requests");
                }}
                className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 text-xs font-bold rounded-lg"
              >
                Simulate New Tow Call
              </button>
            </div>
          ) : (
            <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-wire-200 dark:border-wire-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold uppercase">
                      ACTIVE RECOVERY
                    </span>
                    <h3 className="font-bold text-base text-wire-900 dark:text-white">
                      #{activeJob.dispatchNumber}
                    </h3>
                  </div>
                  <p className="text-xs text-wire-500 mt-0.5">
                    {activeJob.vehicleInfo.make} {activeJob.vehicleInfo.model} (
                    <span className="font-mono font-bold">{activeJob.vehicleInfo.regNumber}</span>) • Destination:{" "}
                    <strong>{activeJob.destinationShopName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <a
                    href={`tel:${activeJob.customerPhone}`}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Motorist</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`📍 Opening GPS navigation coordinates for ${activeJob.pickupAddress}`);
                    }}
                    className="px-3.5 py-1.5 border border-wire-400 rounded-lg font-bold flex items-center gap-1.5 hover:bg-wire-100"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS Nav</span>
                  </button>
                </div>
              </div>

              {/* 5-Stage Stepper */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
                    Towing Progression Lifecycle
                  </span>
                  <span className="font-mono text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    Current: {activeJob.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {stages.map((stage, idx) => {
                    const stageKeys: CraneTowDispatch["status"][] = [
                      "dispatched",
                      "en_route",
                      "arrived",
                      "loaded",
                      "handover_pending",
                      "completed",
                    ];
                    const curIdx = stageKeys.indexOf(activeJob.status);
                    const isDone = idx <= curIdx;
                    const isCurrent = idx === curIdx;

                    return (
                      <div
                        key={stage.key}
                        className={`p-2.5 rounded-lg border transition ${
                          isCurrent
                            ? "border-2 border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-sm"
                            : isDone
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium"
                            : "border-wire-200 dark:border-wire-800 bg-wire-50 dark:bg-wire-900 text-wire-400"
                        }`}
                      >
                        <div className="text-[11px] font-bold">{stage.label}</div>
                        <div className="text-[9px] mt-0.5 opacity-80">{stage.desc}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-wire-200 dark:border-wire-800 gap-3">
                  <div className="text-xs text-wire-500">
                    Motorist is tracking flatbed location on live radar map.
                  </div>
                  {activeJob.status !== "handover_pending" ? (
                    <button
                      type="button"
                      onClick={() => handleNextStage(activeJob)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Advance to Next Stage ➔</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab("handover")}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Proceed to Complete Handover (Enter OTP) ➔</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pre-Tow 4-Point Photo Inspection */}
              <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-wire-50/50 dark:bg-wire-900 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-wire-700" />
                    <span>Pre-Hookup Inspection & Damage Documentation</span>
                  </div>
                  <span className="text-[11px] text-wire-500 font-mono">
                    Mandatory 4 photos to protect operator against liability
                  </span>
                </div>
                <p className="text-wire-500 text-[11px]">
                  Document existing bumper scrapes, fender dents, and glass condition before winching onto hydraulic bed. Tap each box to simulate high-res camera verification.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["front", "rear", "left", "right"] as const).map((angle) => {
                    const isCaptured = activeJob.photos[angle];
                    return (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => {
                          toggleTowPhoto(activeJob.id, angle);
                          showToast(`📸 ${angle.toUpperCase()} angle photo verified!`);
                        }}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer ${
                          isCaptured
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm"
                            : "bg-white dark:bg-wire-850 border-wire-300 hover:border-wire-500 text-wire-600 dark:text-wire-400"
                        }`}
                      >
                        <div className="text-2xl mb-1.5">{isCaptured ? "✅" : "📷"}</div>
                        <div className="font-bold text-xs capitalize">{angle} Flank View</div>
                        <span className="text-[10px] block mt-1">
                          {isCaptured ? "Verified & Watermarked" : "Tap to Capture Photo"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VEHICLE HANDOVER & TRIP COMPLETION (OTP Verification & Payout)       */}
      {/* ========================================================================= */}
      {activeTab === "handover" && (
        <div className="space-y-6">
          <div className="border-b border-wire-300 dark:border-wire-700 pb-3">
            <h2 className="text-base font-bold text-wire-900 dark:text-white">
              Trip Handover & Receipt Verification
            </h2>
            <p className="text-xs text-wire-500">
              Verify receiving garage security OTP, claim highway FASTag tolls, and finalize wallet payout.
            </p>
          </div>

          {!activeJob ? (
            <div className="border border-dashed border-wire-300 rounded-xl p-10 text-center text-xs space-y-2">
              <p className="text-wire-500">No active tow job awaiting handover.</p>
              <button
                type="button"
                onClick={() => {
                  simulateIncomingTow();
                  setActiveTab("requests");
                }}
                className="px-4 py-2 bg-wire-900 text-white rounded font-bold"
              >
                Start a New Tow
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Surcharges & Handover OTP */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Toll & Surcharges Card */}
                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-3 text-xs shadow-sm">
                  <div className="font-bold text-wire-900 dark:text-white flex items-center justify-between">
                    <span>1. Highway Toll & Surcharge Claims</span>
                    <span className="text-emerald-600 font-bold font-mono">
                      Claimed: ₹{activeJob.tollAmount || 0}
                    </span>
                  </div>
                  <p className="text-wire-500 text-[11px]">
                    Did you pay FASTag bridge or expressway tolls while towing the customer vehicle? Add the receipt amount to bill it directly to the trip invoice.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Toll Amount (₹)"
                      value={tollInput}
                      onChange={(e) => setTollInput(e.target.value)}
                      className="border border-wire-300 dark:border-wire-600 rounded-lg px-3 py-2 text-xs font-mono w-32 bg-transparent text-wire-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddToll(activeJob.id)}
                      className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs hover:opacity-90 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Toll Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTollInput("120");
                        addTowToll(activeJob.id, 120);
                        showToast("FASTag toll plaza claim of ₹120 added!");
                      }}
                      className="px-3 py-2 border border-wire-300 rounded-lg text-xs font-medium text-wire-700 hover:bg-wire-100"
                    >
                      + Quick ₹120 Toll
                    </button>
                  </div>
                </div>

                {/* 2. Receiving Garage OTP Verification */}
                <div className="border-2 border-emerald-600/80 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 text-xs shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-wire-200 dark:border-wire-700">
                    <span className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-emerald-600" />
                      <span>2. Receiving Garage Security OTP</span>
                    </span>
                    <span className="font-mono text-[11px] text-wire-400">
                      OTP Hint: <strong className="text-wire-800 dark:text-wire-200">{activeJob.handoverOtp}</strong>
                    </span>
                  </div>
                  <p className="text-wire-500 text-[11px]">
                    Upon unloading at <strong>{activeJob.destinationShopName}</strong>, ask the garage floor manager for their 4-digit handover OTP. Submitting valid OTP confirms physical delivery and releases payment.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="• • • •"
                      value={otpInputs[activeJob.id] || ""}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [activeJob.id]: e.target.value })}
                      className="border border-wire-400 dark:border-wire-600 rounded-lg p-2 text-center font-mono tracking-widest text-base font-bold w-36 bg-transparent text-wire-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleOtpSubmit(activeJob.id)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm"
                    >
                      Verify Handover & Release Payout ✓
                    </button>
                  </div>
                  {otpError[activeJob.id] && (
                    <p className="text-xs text-red-600 font-bold">{otpError[activeJob.id]}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Certified Invoice Preview */}
              <div className="lg:col-span-5">
                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-wire-50 dark:bg-wire-900 space-y-4 text-xs font-mono shadow-sm">
                  <div className="border-b border-wire-300 dark:border-wire-700 pb-3 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-wire-900 dark:text-white">CERTIFIED TOW INVOICE</div>
                      <div className="text-[11px] text-wire-500">#{activeJob.dispatchNumber}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-wire-200 dark:bg-wire-800 text-[10px] font-bold">
                      {activeJob.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-wire-500">Vehicle:</span>
                      <span className="font-bold text-wire-900 dark:text-white">
                        {activeJob.vehicleInfo.make} {activeJob.vehicleInfo.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wire-500">Plate Number:</span>
                      <span className="font-bold text-wire-900 dark:text-white">
                        {activeJob.vehicleInfo.regNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wire-500">Carrier Unit:</span>
                      <span>Flatbed #1 ({activeJob.truckPlate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wire-500">Total Distance:</span>
                      <span>{activeJob.distanceKm} km transit</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-wire-300 dark:border-wire-700 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-wire-500">Base Hookup Fee (First 5 km):</span>
                      <span>{formatCurrency(activeJob.baseFare)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wire-500">
                        Transit Distance ({Math.max(0, activeJob.distanceKm - 5).toFixed(1)} km @ ₹{activeJob.perKmRate}):
                      </span>
                      <span>{formatCurrency(Math.round(Math.max(0, activeJob.distanceKm - 5) * activeJob.perKmRate))}</span>
                    </div>
                    {activeJob.tollAmount ? (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Highway FASTag Toll Plaza Surcharge:</span>
                        <span>+{formatCurrency(activeJob.tollAmount)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-3 border-t-2 border-wire-900 dark:border-white flex justify-between items-center text-sm font-bold">
                    <span className="text-wire-900 dark:text-white">Total Payout to Wallet:</span>
                    <span className="text-emerald-600 text-lg">{formatCurrency(activeJob.totalFare)}</span>
                  </div>

                  <div className="text-[10px] text-wire-400 text-center pt-2">
                    Direct electronic transfer to driver wallet upon OTP clearance.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TOW RATES & DISPATCH RADIUS CONFIGURATION                          */}
      {/* ========================================================================= */}
      {activeTab === "rates" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-wire-300 dark:border-wire-700 pb-3">
            <h2 className="text-base font-bold text-wire-900 dark:text-white">
              Tow Rates & Dispatch Radius Configuration
            </h2>
            <p className="text-xs text-wire-500">
              Configure your upfront pricing parameters and GPS coverage broadcast.
            </p>
          </div>

          <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-6 bg-white dark:bg-wire-850 space-y-5 text-xs shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-wire-700 dark:text-wire-300 mb-1">
                  Base Mobilization / Hookup Fee (₹)
                </label>
                <input
                  type="number"
                  value={ratesConfig.baseFare}
                  onChange={(e) => setRatesConfig({ ...ratesConfig, baseFare: Number(e.target.value) })}
                  className="w-full border border-wire-300 rounded-lg p-2.5 font-mono text-sm bg-transparent text-wire-900 dark:text-white"
                />
                <span className="text-[10px] text-wire-400 mt-1 block">Includes first 5 km and hydraulic bed winch</span>
              </div>

              <div>
                <label className="block font-bold text-wire-700 dark:text-wire-300 mb-1">
                  Transit Distance Rate (₹ / km)
                </label>
                <input
                  type="number"
                  value={ratesConfig.perKmRate}
                  onChange={(e) => setRatesConfig({ ...ratesConfig, perKmRate: Number(e.target.value) })}
                  className="w-full border border-wire-300 rounded-lg p-2.5 font-mono text-sm bg-transparent text-wire-900 dark:text-white"
                />
                <span className="text-[10px] text-wire-400 mt-1 block">Billed per kilometer beyond the first 5 km</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-wire-700 dark:text-wire-300">
                  Active Dispatch Radar Radius: <span className="font-mono text-amber-600">{ratesConfig.dispatchRadiusKm} km</span>
                </label>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={ratesConfig.dispatchRadiusKm}
                onChange={(e) => setRatesConfig({ ...ratesConfig, dispatchRadiusKm: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-wire-400 font-mono mt-1">
                <span>10 km (City Only)</span>
                <span>35 km</span>
                <span>60 km (Full Highway Corridor)</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-wire-700 dark:text-wire-300 mb-1">
                Carrier Tow Truck Type
              </label>
              <select
                value={ratesConfig.truckType}
                onChange={(e) => setRatesConfig({ ...ratesConfig, truckType: e.target.value })}
                className="w-full border border-wire-300 rounded-lg p-2.5 text-xs bg-white dark:bg-wire-800 text-wire-900 dark:text-white"
              >
                <option>Hydraulic Rollback Flatbed (3.5T)</option>
                <option>Underlift Wheel-Lift Carrier (2.5T)</option>
                <option>Heavy Winch Boom Crane (10T+)</option>
              </select>
            </div>

            <div className="p-3 border border-wire-200 dark:border-wire-700 rounded-lg bg-wire-50 dark:bg-wire-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-wire-900 dark:text-white">Night Standby Surcharge (+25%)</div>
                <div className="text-[10px] text-wire-500">Auto-applies between 11:00 PM and 06:00 AM</div>
              </div>
              <input
                type="checkbox"
                checked={ratesConfig.nightSurcharge}
                onChange={(e) => setRatesConfig({ ...ratesConfig, nightSurcharge: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => showToast("✅ Tow tariff and coverage radius updated successfully!")}
              className="w-full py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm"
            >
              Save Configuration Settings ➔
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TRIP LOGS & HANDOVER INVOICES                                      */}
      {/* ========================================================================= */}
      {activeTab === "trips" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-wire-300 dark:border-wire-700 pb-3">
            <div>
              <h2 className="text-base font-bold text-wire-900 dark:text-white">
                Trip Logs & Certified Invoices
              </h2>
              <p className="text-xs text-wire-500">
                Audit trail of completed roadside recoveries, kilometer audits, and customer signatures.
              </p>
            </div>
          </div>

          <div className="border border-wire-300 dark:border-wire-700 rounded-xl overflow-hidden bg-white dark:bg-wire-850 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-wire-100 dark:bg-wire-800 border-b border-wire-300 dark:border-wire-700 font-mono text-[11px] text-wire-600 dark:text-wire-300">
                    <th className="p-3">TRIP ID</th>
                    <th className="p-3">RECOVERED VEHICLE</th>
                    <th className="p-3">ROUTE (FROM ➔ TO)</th>
                    <th className="p-3">TRANSIT</th>
                    <th className="p-3">TOLL CLAIM</th>
                    <th className="p-3">FARE PAID</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wire-200 dark:divide-wire-700">
                  {completedTows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-wire-400">
                        No completed trips recorded yet in this session. Complete a tow handover to see it logged here.
                      </td>
                    </tr>
                  ) : (
                    completedTows.map((t) => (
                      <tr key={t.id} className="hover:bg-wire-50 dark:hover:bg-wire-800/50">
                        <td className="p-3 font-mono font-bold text-wire-900 dark:text-white">
                          #{t.dispatchNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-wire-900 dark:text-white">
                            {t.vehicleInfo.make} {t.vehicleInfo.model}
                          </div>
                          <span className="font-mono text-[10px] text-wire-500">{t.vehicleInfo.regNumber}</span>
                        </td>
                        <td className="p-3">
                          <div className="text-[11px]">{t.pickupAddress}</div>
                          <div className="text-[10px] text-wire-400">➔ {t.destinationShopName}</div>
                        </td>
                        <td className="p-3 font-mono">{t.distanceKm} km</td>
                        <td className="p-3 font-mono text-emerald-600">
                          {t.tollAmount ? `+₹${t.tollAmount}` : "₹0"}
                        </td>
                        <td className="p-3 font-mono font-bold text-wire-900 dark:text-white">
                          {formatCurrency(t.totalFare)}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              alert(
                                `📄 CERTIFIED TOW RECEIPT #${t.dispatchNumber}\n\nVehicle: ${t.vehicleInfo.make} ${t.vehicleInfo.model} (${t.vehicleInfo.regNumber})\nRoute: ${t.pickupAddress} to ${t.destinationShopName}\nTotal Distance: ${t.distanceKm} km\nBase Fee: ₹${t.baseFare}\nPer-Km: ₹${t.perKmRate}/km\nFASTag Toll: ₹${t.tollAmount || 0}\nTotal Billed: ₹${t.totalFare}\nStatus: VERIFIED VIA OTP`
                              )
                            }
                            className="px-2.5 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100 flex items-center gap-1 text-[11px]"
                          >
                            <Download className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Seeded previous trip for rich display */}
                  <tr className="hover:bg-wire-50 dark:hover:bg-wire-800/50">
                    <td className="p-3 font-mono font-bold text-wire-900 dark:text-white">#TOW-2026-419</td>
                    <td className="p-3">
                      <div className="font-bold text-wire-900 dark:text-white">Swift Dzire (Manual)</div>
                      <span className="font-mono text-[10px] text-wire-500">KL-07-CC-1234</span>
                    </td>
                    <td className="p-3">
                      <div className="text-[11px]">Highway Exit 4 (Service Lane)</div>
                      <div className="text-[10px] text-wire-400">➔ Workshop #1 (City Garage)</div>
                    </td>
                    <td className="p-3 font-mono">18.0 km</td>
                    <td className="p-3 font-mono text-emerald-600">+₹120</td>
                    <td className="p-3 font-mono font-bold text-wire-900 dark:text-white">₹2,345</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "📄 CERTIFIED TOW RECEIPT #TOW-2026-419\n\nVehicle: Swift Dzire (KL-07-CC-1234)\nRoute: Highway Exit 4 to Workshop #1\nDistance: 18.0 km\nTotal Billed: ₹2,345\nStatus: VERIFIED & COMPLETED"
                          )
                        }
                        className="px-2.5 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100 flex items-center gap-1 text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: EARNINGS & WALLET WITHDRAWAL                                       */}
      {/* ========================================================================= */}
      {activeTab === "earnings" && (
        <div className="space-y-6">
          <div className="border-b border-wire-300 dark:border-wire-700 pb-3">
            <h2 className="text-base font-bold text-wire-900 dark:text-white">
              Towing Earnings & Wallet
            </h2>
            <p className="text-xs text-wire-500">
              Direct digital payouts, highway toll reimbursements, and instant bank transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-1">
              <span className="text-[10px] font-mono uppercase text-wire-400">Available Driver Balance</span>
              <div className="text-3xl font-bold font-mono text-emerald-600">
                ₹{walletBalance.toLocaleString()}
              </div>
              <div className="text-wire-500 text-[11px]">Ready for instant transfer</div>
            </div>

            <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-1">
              <span className="text-[10px] font-mono uppercase text-wire-400">Total Transferred</span>
              <div className="text-3xl font-bold font-mono text-wire-900 dark:text-white">
                ₹{withdrawnTotal.toLocaleString()}
              </div>
              <div className="text-wire-500 text-[11px]">To Bank Account #•••• 9042</div>
            </div>

            <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-1">
              <span className="text-[10px] font-mono uppercase text-wire-400">Highway Toll Reimbursements</span>
              <div className="text-3xl font-bold font-mono text-amber-600">
                ₹{(totalTollsClaimed + 320).toLocaleString()}
              </div>
              <div className="text-wire-500 text-[11px]">100% pass-through from customers</div>
            </div>
          </div>

          {/* Withdraw Form Card */}
          <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-6 bg-white dark:bg-wire-850 space-y-4 max-w-lg text-xs shadow-sm">
            <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Instant Payout to Bank Account / UPI</span>
            </h3>

            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-wire-600 dark:text-wire-400 mb-1">Enter Amount to Transfer (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    max={walletBalance}
                    min={100}
                    placeholder="e.g. 2500"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="flex-1 border border-wire-300 rounded-lg p-2.5 font-mono text-sm bg-transparent text-wire-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(walletBalance))}
                    className="px-3 py-2.5 border border-wire-300 rounded-lg text-xs font-bold text-wire-700 hover:bg-wire-100"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg text-[11px] text-wire-600 space-y-1">
                <div className="flex justify-between">
                  <span>Linked Account:</span>
                  <strong className="font-mono text-wire-900 dark:text-white">State Bank of India (•••9042)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <strong className="text-emerald-600">₹0 (Free IMPS)</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing || walletBalance <= 0}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition"
              >
                {isWithdrawing ? "Processing IMPS Transfer..." : "Transfer Payout Now ➔"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: DRIVER REVIEWS & REPUTATION LEDGER                                 */}
      {/* ========================================================================= */}
      {activeTab === "reviews" && (
        <div className="space-y-5">
          <div className="border-b border-wire-300 dark:border-wire-700 pb-3">
            <h2 className="text-base font-bold text-wire-900 dark:text-white">
              Driver & Fleet Reputation Ledger
            </h2>
            <p className="text-xs text-wire-500">
              Verified customer feedback and garage ratings collected after successful OTP handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 border border-wire-300 rounded-xl bg-white dark:bg-wire-850 text-center space-y-1">
              <span className="text-3xl font-bold font-mono text-amber-500">4.9 ★</span>
              <div className="font-bold text-wire-900 dark:text-white text-xs">Overall Driver Rating</div>
              <div className="text-[10px] text-wire-400">Based on 142 verified tows</div>
            </div>

            <div className="p-5 border border-wire-300 rounded-xl bg-white dark:bg-wire-850 text-center space-y-1">
              <span className="text-3xl font-bold font-mono text-emerald-600">99.2%</span>
              <div className="font-bold text-wire-900 dark:text-white text-xs">Zero-Damage Record</div>
              <div className="text-[10px] text-wire-400">Pre-tow photos validated</div>
            </div>

            <div className="p-5 border border-wire-300 rounded-xl bg-white dark:bg-wire-850 text-center space-y-1">
              <span className="text-3xl font-bold font-mono text-wire-900 dark:text-white">16 min</span>
              <div className="font-bold text-wire-900 dark:text-white text-xs">Average Highway ETA</div>
              <div className="text-[10px] text-wire-400">Within 15 km radar</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wire-900 dark:text-white">
                  Motorist (Innova Automatic)
                </span>
                <span className="text-amber-500 font-bold font-mono">★★★★★ 5.0</span>
              </div>
              <p className="text-wire-600 dark:text-wire-400 italic">
                &ldquo;Arrived within 15 minutes on the bypass highway. Winched the car using wheel straps without putting any stress on the locked transmission. Very professional.&rdquo;
              </p>
              <span className="text-[10px] text-wire-400 block pt-1">Verified Highway Rescue • Yesterday</span>
            </div>

            <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-wire-900 dark:text-white">Workshop #1 (Receiving Garage)</span>
                <span className="text-amber-500 font-bold font-mono">★★★★★ 5.0</span>
              </div>
              <p className="text-wire-600 dark:text-wire-400 italic">
                &ldquo;Seamless handover with verified pre-tow photo records and correct odometer recording. Dropped straight into our alignment bay.&rdquo;
              </p>
              <span className="text-[10px] text-wire-400 block pt-1">Garage Floor Manager • 3 days ago</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: TRUCK & RTO PERMITS PROFILE                                        */}
      {/* ========================================================================= */}
      {activeTab === "truck" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-wire-300 dark:border-wire-700 pb-3">
            <h2 className="text-base font-bold text-wire-900 dark:text-white">
              Tow Truck Specifications & Commercial Permits
            </h2>
            <p className="text-xs text-wire-500">
              RTO statutory compliance, crane cable test reports, and carrier insurance.
            </p>
          </div>

          <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-6 bg-white dark:bg-wire-850 space-y-4 text-xs shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-wire-200 dark:border-wire-700">
              <div>
                <span className="text-[10px] font-mono text-wire-400 uppercase">Commercial Registration</span>
                <div className="font-mono text-lg font-bold text-wire-900 dark:text-white">KL-07-EE-9090</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                ✓ ALL PERMITS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 border border-wire-200 dark:border-wire-700 rounded-lg">
                <span className="text-[10px] font-mono text-wire-400 uppercase">RTO Fitness Certificate</span>
                <div className="font-bold text-wire-900 dark:text-white mt-0.5">Valid until 18 Dec 2027</div>
                <span className="text-[10px] text-emerald-600 font-bold">Pass • Heavy Recovery Category</span>
              </div>

              <div className="p-3 border border-wire-200 dark:border-wire-700 rounded-lg">
                <span className="text-[10px] font-mono text-wire-400 uppercase">National All-India Permit</span>
                <div className="font-bold text-wire-900 dark:text-white mt-0.5">Valid until 30 Oct 2028</div>
                <span className="text-[10px] text-emerald-600 font-bold">Unrestricted Highway Transit</span>
              </div>

              <div className="p-3 border border-wire-200 dark:border-wire-700 rounded-lg">
                <span className="text-[10px] font-mono text-wire-400 uppercase">Hydraulic Winch Cable Test</span>
                <div className="font-bold text-wire-900 dark:text-white mt-0.5">12.5T Breaking Capacity</div>
                <span className="text-[10px] text-emerald-600 font-bold">Certified OEM Steel Core</span>
              </div>

              <div className="p-3 border border-wire-200 dark:border-wire-700 rounded-lg">
                <span className="text-[10px] font-mono text-wire-400 uppercase">Comprehensive Carrier Insurance</span>
                <div className="font-bold text-wire-900 dark:text-white mt-0.5">₹50,00,000 In-Transit Cover</div>
                <span className="text-[10px] text-emerald-600 font-bold">Valid until 15 Aug 2027</span>
              </div>
            </div>

            <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg text-wire-500 text-[11px] leading-relaxed">
              💡 <strong>Compliance Note:</strong> Under GearUp Partner Standards, tow units undergo quarterly mechanical winch safety inspections to guarantee zero in-transit damage.
            </div>
          </div>
        </div>
      )}
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
