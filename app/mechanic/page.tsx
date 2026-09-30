"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import {
  Wrench,
  Clock,
  CheckCircle2,
  Star,
  Check,
  X,
  Phone,
  AlertTriangle,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Sliders,
  Settings,
  ShieldCheck,
  Camera,
  Plus,
  ArrowRight,
  Navigation,
  Key,
  Truck,
  RotateCcw,
  Download,
  Share2,
  ChevronRight,
  Shield
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

type MechanicTab =
  | "m-dashboard"
  | "m-requests"
  | "m-booking-details"
  | "m-log-service"
  | "m-services-prices"
  | "m-service-logs"
  | "m-reviews"
  | "m-earnings"
  | "m-availability"
  | "m-profile"
  | "m-notifications";

function MechanicDashboardContent() {
  const { bookings, updateBookingStatus, logServiceOdometer, shops } = useApp();
  const currentShop = shops[0] || {
    id: "shop-1",
    name: "Workshop #1",
    rating: 4.9,
    address: "Building #4, Bypass Service Road, Near Junction #2",
  };

  // State Variables
  const [activeTab, setActiveTab] = useState<MechanicTab>("m-dashboard");
  const [mechanicStatus, setMechanicStatus] = useState<"available" | "busy" | "offline">("available");
  const [flowMode, setFlowMode] = useState<"onsite" | "offsite">("onsite");
  const [jobStage, setJobStage] = useState<"accepted" | "on_the_way" | "arrived" | "in_service" | "completed">("arrived");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // Suggest quote inputs
  const [suggestIssue, setSuggestIssue] = useState("Front Brake Pads worn (2mm remaining)");
  const [suggestLabor, setSuggestLabor] = useState("350");
  const [suggestPart, setSuggestPart] = useState("850");

  // Log service inputs
  const [logOdometer, setLogOdometer] = useState("45250");
  const [partsList, setPartsList] = useState<{ name: string; qty: number; unitPrice: number }[]>([
    { name: "Alternator V-Ribbed Belt (OEM)", qty: 1, unitPrice: 450 },
    { name: "Battery Terminal Anti-Corrosion Spray", qty: 1, unitPrice: 120 },
  ]);
  const [newPartName, setNewPartName] = useState("");
  const [newPartPrice, setNewPartPrice] = useState("450");
  const [newPartQty, setNewPartQty] = useState("1");

  // Earnings Timeframe
  const [earningsPeriod, setEarningsPeriod] = useState<"today" | "week" | "month">("today");

  // Countdown Timer simulation (02:15)
  const [countdownSeconds, setCountdownSeconds] = useState(135);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 135));
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

  // Handlers
  const handleAcceptRequest = () => {
    setMechanicStatus("busy");
    setActiveTab("m-booking-details");
    setJobStage("accepted");
    showToast("✅ Breakdown call accepted! Transitioned to Active Job details.");
  };

  const handleConfirmReject = () => {
    setIsRejectModalOpen(false);
    showToast("Request declined and forwarded to the next nearest workshop.");
  };

  const handleConfirmOffline = () => {
    setIsOfflineModalOpen(false);
    setMechanicStatus("offline");
    showToast("Workshop status set to: Offline (Hidden from search).");
  };

  const handleAddPartToTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName || !newPartPrice) return;
    setPartsList([
      ...partsList,
      { name: newPartName, qty: Number(newPartQty) || 1, unitPrice: Number(newPartPrice) },
    ]);
    setNewPartName("");
    setNewPartPrice("450");
    setIsAddPartModalOpen(false);
    showToast("Part added to service invoice!");
  };

  const handleRemovePart = (index: number) => {
    setPartsList(partsList.filter((_, i) => i !== index));
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestModalOpen(false);
    showToast("💬 Additional price quote sent to customer for in-app approval!");
  };

  const handleSaveServiceLog = () => {
    if (!logOdometer) {
      alert("Please enter the mandatory odometer reading.");
      return;
    }
    const laborTotal = 350;
    const partsFormatted = partsList.map((p) => ({ name: p.name, cost: p.unitPrice * p.qty }));
    if (bookings[0]?.id) {
      logServiceOdometer(bookings[0].id, Number(logOdometer), partsFormatted, laborTotal);
    }
    setMechanicStatus("available");
    showToast(`✅ Service finalized and logged at ${logOdometer} km! Digital receipt generated.`);
    setActiveTab("m-service-logs");
  };

  // Calculations for Invoice
  const partsTotal = partsList.reduce((sum, p) => sum + p.unitPrice * p.qty, 0);
  const laborTotal = 350;
  const visitFee = flowMode === "onsite" ? 150 : 0;
  const gstTax = Math.round(laborTotal * 0.18);
  const grandTotal = laborTotal + partsTotal + visitFee + gstTax;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-wire-900 text-white dark:bg-white dark:text-wire-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 border border-wire-700 animate-in fade-in slide-in-from-bottom-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CONTROLLER BAR / WORKBENCH HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-wire-850 border border-wire-300 dark:border-wire-700 rounded-xl p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-wire-900 text-white dark:bg-white dark:text-wire-900 text-xs font-mono font-bold">
              🛠️ PARTNER
            </span>
            <h1 className="text-lg md:text-xl font-bold text-wire-900 dark:text-white">
              {currentShop.name}
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                mechanicStatus === "available"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                  : mechanicStatus === "busy"
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                  : "bg-wire-200 dark:bg-wire-800 text-wire-600 dark:text-wire-400"
              }`}
            >
              {mechanicStatus === "available" ? "ONLINE" : mechanicStatus === "busy" ? "BUSY" : "OFFLINE"}
            </span>
          </div>
          <p className="text-xs text-wire-500 mt-1">
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

        {/* Big Visual Status Switcher */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-[11px] font-bold text-wire-800 dark:text-wire-200">Current Radar</div>
            <div className="text-[10px] text-wire-500">15 km radius active</div>
          </div>

          <div className="flex items-center bg-wire-100 dark:bg-wire-800 p-0.5 rounded-lg border border-wire-300 dark:border-wire-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setMechanicStatus("available");
                showToast("Status set to: Available");
              }}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                mechanicStatus === "available"
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
                setMechanicStatus("busy");
                showToast("Status set to: Busy");
              }}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                mechanicStatus === "busy"
                  ? "bg-white dark:bg-wire-700 shadow-sm text-amber-700 dark:text-amber-300 font-bold"
                  : "text-wire-600 dark:text-wire-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Busy</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOfflineModalOpen(true)}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                mechanicStatus === "offline"
                  ? "bg-white dark:bg-wire-700 shadow-sm text-wire-900 dark:text-white font-bold"
                  : "text-wire-600 dark:text-wire-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-wire-400"></span>
              <span>Offline</span>
            </button>
          </div>
        </div>
      </div>

      {/* WORKBENCH BODY: SIDEBAR + CONTENT VIEWPORT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* DESKTOP SIDEBAR (3 COLS) */}
        <aside className="md:col-span-3 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 p-3 space-y-1 text-xs font-medium shadow-sm">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-wire-400">
            Operations
          </div>

          <button
            onClick={() => setActiveTab("m-dashboard")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-dashboard"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📊</span>
              <span>Dashboard</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-requests")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-requests"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>⚡</span>
              <span>Incoming Requests</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">
              1
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-booking-details")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-booking-details"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📍</span>
              <span>Active Bookings</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          <button
            onClick={() => setActiveTab("m-log-service")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-log-service"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📝</span>
              <span>Log Service</span>
            </span>
          </button>

          <div className="pt-3 px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-wire-400">
            Shop Management
          </div>

          <button
            onClick={() => setActiveTab("m-services-prices")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-services-prices"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🏷️</span>
              <span>Services & Prices</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-service-logs")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-service-logs"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>📋</span>
              <span>Service Logs</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-reviews")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-reviews"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>⭐</span>
              <span>Reviews</span>
            </span>
            <span className="text-[10px] font-mono text-wire-500">4.9</span>
          </button>

          <button
            onClick={() => setActiveTab("m-earnings")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-earnings"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>💰</span>
              <span>Earnings</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-availability")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-availability"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🕒</span>
              <span>Availability</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("m-profile")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              activeTab === "m-profile"
                ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                : "text-wire-600 hover:bg-wire-100 dark:text-wire-300 dark:hover:bg-wire-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🏪</span>
              <span>Shop Profile</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
              VERIFIED
            </span>
          </button>

          <div className="pt-4 border-t border-wire-200 dark:border-wire-800">
            <div className="p-2.5 bg-wire-50 dark:bg-wire-800 rounded-lg text-[11px] text-wire-600 dark:text-wire-400 flex items-center justify-between">
              <div>
                <div className="font-bold text-wire-900 dark:text-white">Auto-Busy Mode</div>
                <div className="text-[10px]">When job starts</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-wire-900 accent-wire-900 cursor-pointer" />
            </div>
          </div>
        </aside>

        {/* MAIN VIEWPORT (9 COLS) */}
        <main className="md:col-span-9 space-y-6">
          {/* ========================================================================= */}
          {/* 1. TAB: DASHBOARD                                                         */}
          {/* ========================================================================= */}
          {activeTab === "m-dashboard" && (
            <div className="space-y-6">
              {/* Today's Summary Metrics (4 Cards) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  onClick={() => setActiveTab("m-requests")}
                  className="cursor-pointer border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-red-400 transition"
                >
                  <div className="flex items-center justify-between mb-1 text-xs text-wire-500 font-medium">
                    <span>New Requests</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-wire-900 dark:text-white">1</span>
                    <span className="text-[10px] text-red-600 font-bold bg-red-50 dark:bg-red-950 px-1 rounded">
                      {formatTimer(countdownSeconds)} left
                    </span>
                  </div>
                  <div className="text-[10px] text-wire-400 mt-1">Requires immediate response</div>
                </div>

                <div
                  onClick={() => setActiveTab("m-booking-details")}
                  className="cursor-pointer border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 transition"
                >
                  <div className="text-xs text-wire-500 font-medium mb-1">Active Jobs</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">2</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">1 Onsite • 1 In Garage</div>
                </div>

                <div
                  onClick={() => setActiveTab("m-service-logs")}
                  className="cursor-pointer border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 transition"
                >
                  <div className="text-xs text-wire-500 font-medium mb-1">Completed Today</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">5</div>
                  <div className="text-[10px] text-wire-400 mt-1">Avg turnaround: 42 mins</div>
                </div>

                <div
                  onClick={() => setActiveTab("m-earnings")}
                  className="cursor-pointer border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 hover:border-wire-500 transition"
                >
                  <div className="text-xs text-wire-500 font-medium mb-1">Today's Earnings</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">₹4,250</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">+18% vs yesterday</div>
                </div>
              </div>

              {/* Priority Emergency Breakdown Card */}
              <div className="border-2 border-red-500/80 rounded-xl p-4 bg-red-50/40 dark:bg-red-950/20 space-y-3 shadow-sm">
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
                    <span>⏱️ Expiring in:</span>
                    <span>{formatTimer(countdownSeconds)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-xs bg-white dark:bg-wire-900 p-3.5 rounded-lg border border-red-200 dark:border-red-900/50">
                  <div>
                    <div className="text-wire-400 text-[10px] uppercase font-mono">Customer & Vehicle</div>
                    <div className="font-bold text-wire-900 dark:text-white text-sm">Swift Dzire (White)</div>
                    <div className="text-wire-500 font-mono text-[11px]">KL-07-CC-1234 • Car</div>
                  </div>

                  <div>
                    <div className="text-wire-400 text-[10px] uppercase font-mono">Location & Mode</div>
                    <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1">
                      <span>🚐 Onsite Service</span>
                      <span className="text-xs text-wire-400">(3.2 km)</span>
                    </div>
                    <div className="text-wire-500 text-[11px] truncate">Near North Overbridge, MG Road</div>
                  </div>

                  <div>
                    <div className="text-wire-400 text-[10px] uppercase font-mono">Reported Issue & Payout</div>
                    <div className="font-bold text-wire-900 dark:text-white">Engine stalled + Battery dead</div>
                    <div className="text-emerald-600 font-bold font-mono text-[11px]">
                      Est. Payout: ₹650 (Visit + Jumpstart)
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(true)}
                    className="px-3.5 py-1.5 border border-wire-300 dark:border-wire-700 text-wire-700 dark:text-wire-300 rounded-lg font-medium text-xs hover:bg-wire-100"
                  >
                    Decline / Forward
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptRequest}
                    className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Accept Breakdown Call (1-Tap) ➔</span>
                  </button>
                </div>
              </div>

              {/* Two-Column Layout: Active Bookings & Reviews */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left: Active & Scheduled Jobs (8 Cols) */}
                <div className="lg:col-span-8 border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-wire-200 dark:border-wire-800">
                    <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-2">
                      <span>📅 Active & Scheduled Jobs</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-wire-100 dark:bg-wire-800 text-wire-700 dark:text-wire-300">
                        2 active
                      </span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("m-booking-details")}
                      className="text-xs text-wire-600 dark:text-wire-400 underline hover:text-wire-900"
                    >
                      View Details ›
                    </button>
                  </div>

                  {/* Booking Row 1 */}
                  <div className="p-3 border border-wire-200 dark:border-wire-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-wire-50/50 dark:bg-wire-800/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                          🚐 ONSITE
                        </span>
                        <span className="font-bold text-wire-900 dark:text-white">Customer #41 • Classic 350</span>
                        <span className="text-wire-400 font-mono text-[10px]">#BK-8021</span>
                      </div>
                      <div className="text-[11px] text-wire-500">Service: Chain Lube & Clutch Cable • Arrived at customer location</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-bold text-[11px]">
                        🔧 In Service
                      </span>
                      <button
                        onClick={() => setActiveTab("m-log-service")}
                        className="px-3 py-1 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-medium hover:opacity-90"
                      >
                        Complete & Log ›
                      </button>
                    </div>
                  </div>

                  {/* Booking Row 2 */}
                  <div className="p-3 border border-wire-200 dark:border-wire-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[10px]">
                          🏢 OFFSITE
                        </span>
                        <span className="font-bold text-wire-900 dark:text-white">Customer #52 • Honda City</span>
                        <span className="text-wire-400 font-mono text-[10px]">#BK-8024</span>
                      </div>
                      <div className="text-[11px] text-wire-500">Service: Brake Disc Turn & Pad Change • Slot: Today 2:30 PM</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-wire-100 dark:bg-wire-800 text-wire-700 dark:text-wire-300 rounded font-medium text-[11px]">
                        Awaiting Arrival
                      </span>
                      <button
                        onClick={() => setActiveTab("m-booking-details")}
                        className="px-3 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100"
                      >
                        View Job ›
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Latest Reviews (4 Cols) */}
                <div className="lg:col-span-4 border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-wire-200 dark:border-wire-800">
                    <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-1.5">
                      <span>⭐ Recent Reviews</span>
                      <span className="text-xs font-mono font-normal text-wire-500">(4.9/5.0)</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("m-reviews")}
                      className="text-xs text-wire-600 underline hover:text-wire-900"
                    >
                      All ›
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 rounded bg-wire-50 dark:bg-wire-800 border border-wire-200 dark:border-wire-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-wire-900 dark:text-white">Customer (Swift Dzire)</span>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-[11px] text-wire-600 dark:text-wire-400 italic">
                        "Mechanic arrived in 18 minutes. Tested alternator, swapped battery, and gave transparent bill."
                      </p>
                      <div className="text-[10px] text-wire-400 flex justify-between items-center pt-1">
                        <span>2 hours ago • Verified Job</span>
                        <button onClick={() => setIsReplyModalOpen(true)} className="underline text-wire-700 dark:text-wire-300">
                          Reply
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-wire-50 dark:bg-wire-800 border border-wire-200 dark:border-wire-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-wire-900 dark:text-white">Customer (Classic 350)</span>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-[11px] text-wire-600 dark:text-wire-400 italic">
                        "Accurate odometer logging and genuine OEM chain spray used."
                      </p>
                      <div className="text-[10px] text-wire-400 flex justify-between items-center pt-1">
                        <span>Yesterday • Verified Job</span>
                        <button onClick={() => setIsReplyModalOpen(true)} className="underline text-wire-700 dark:text-wire-300">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TAB: INCOMING REQUESTS                                                 */}
          {/* ========================================================================= */}
          {activeTab === "m-requests" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white flex items-center gap-2">
                    <span>⚡ Incoming Customer Requests</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-mono font-bold">
                      1 ACTIVE
                    </span>
                  </h2>
                  <p className="text-xs text-wire-500">Live breakdown requests dispatched to you based on your 15 km service radius.</p>
                </div>

                <div className="flex items-center gap-1 text-xs border border-wire-300 dark:border-wire-700 rounded-lg p-0.5 bg-wire-50 dark:bg-wire-900">
                  <button className="px-3 py-1 bg-white dark:bg-wire-700 rounded shadow-sm font-bold text-wire-900 dark:text-white">Active (1)</button>
                  <button className="px-3 py-1 text-wire-600 dark:text-wire-400 hover:text-wire-900">Forwarded (2)</button>
                  <button className="px-3 py-1 text-wire-600 dark:text-wire-400 hover:text-wire-900">Expired</button>
                </div>
              </div>

              {/* Live Request Card */}
              <div className="border-2 border-wire-900 dark:border-white rounded-xl p-5 bg-white dark:bg-wire-850 shadow-md space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wire-200 dark:border-wire-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>🚨</span>
                      <span>Emergency Breakdown</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs">
                      🚐 Onsite Request
                    </span>
                    <span className="px-2 py-1 rounded bg-wire-100 dark:bg-wire-800 text-wire-700 dark:text-wire-300 text-xs font-mono">
                      📍 3.2 km from shop
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 px-3 py-1.5 rounded-lg text-red-700 dark:text-red-300 font-mono text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span>Respond in:</span>
                    <span>{formatTimer(countdownSeconds)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-12 gap-5">
                  <div className="md:col-span-4 space-y-2">
                    <div className="text-[10px] font-mono text-wire-400 uppercase">Customer & Vehicle</div>
                    <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg border border-wire-200 dark:border-wire-700 space-y-1">
                      <div className="font-bold text-sm text-wire-900 dark:text-white">Swift Dzire (White)</div>
                      <div className="font-mono text-wire-600 dark:text-wire-300">Reg: KL-07-CC-1234</div>
                      <div className="text-wire-500">Odometer: ~45,200 km • Petrol</div>
                      <div className="pt-1 text-[11px] text-wire-500 border-t border-wire-200 dark:border-wire-700 mt-2">
                        Customer: <strong className="text-wire-800 dark:text-wire-200">Customer #41</strong> (Phone revealed on Accept)
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <div className="text-[10px] font-mono text-wire-400 uppercase">Breakdown Spot</div>
                    <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg border border-wire-200 dark:border-wire-700 space-y-1">
                      <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1">
                        <span>📍</span>
                        <span>Service Road, Near Overbridge #4</span>
                      </div>
                      <div className="text-wire-500">Landmark: Opposite Metro Pillar 412</div>
                      <div className="text-wire-500 font-mono text-[11px]">Est. drive time: 8-10 mins</div>
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <div className="text-[10px] font-mono text-wire-400 uppercase">Checklist & Symptoms</div>
                    <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg border border-wire-200 dark:border-wire-700 space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <span>✓</span>
                          <span>Jumpstart / Battery check (Standard)</span>
                        </div>
                        <div className="flex items-start gap-1.5 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                          <span className="text-amber-600 font-bold">⚠️</span>
                          <div>
                            <strong>Custom Issue:</strong>
                            <div className="text-[10px]">"Car died while idling at traffic light. Smells like hot rubber."</div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-wire-200 dark:border-wire-700 flex justify-between items-center text-[11px]">
                        <span className="text-wire-500">Base Estimate:</span>
                        <strong className="font-mono text-emerald-600 text-sm">₹650 (Visit ₹150 + Labor)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-wire-200 dark:border-wire-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-wire-500">
                    ⚠️ If not accepted before timer expires, request automatically forwards to the next nearest mechanic.
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsRejectModalOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-wire-400 rounded-lg text-xs font-bold text-wire-700 dark:text-wire-300 hover:bg-red-50"
                    >
                      Reject / Pass
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptRequest}
                      className="flex-1 sm:flex-none px-6 py-2 bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 shadow-sm"
                    >
                      Accept Job Now (1-Tap) ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. TAB: BOOKING DETAILS (ONSITE / OFFSITE STEPPER & QUOTE)                 */}
          {/* ========================================================================= */}
          {activeTab === "m-booking-details" && (
            <div className="space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-wire-900 dark:text-white">Active Job #BK-8021</h2>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs">
                      {flowMode === "onsite" ? "🚐 ONSITE SERVICE" : "🏢 OFFSITE (IN GARAGE)"}
                    </span>
                  </div>
                  <p className="text-wire-500 text-xs mt-0.5">Swift Dzire (KL-07-CC-1234) • Customer Contact Active</p>
                </div>

                <div className="flex items-center gap-2 bg-wire-100 dark:bg-wire-800 p-1 rounded-lg border border-wire-300 dark:border-wire-700">
                  <span className="text-[10px] text-wire-500 font-mono pl-1">FLOW:</span>
                  <button
                    type="button"
                    onClick={() => setFlowMode("onsite")}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      flowMode === "onsite"
                        ? "bg-white dark:bg-wire-700 text-wire-900 dark:text-white shadow-sm"
                        : "text-wire-600 dark:text-wire-400"
                    }`}
                  >
                    Onsite Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowMode("offsite")}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      flowMode === "offsite"
                        ? "bg-white dark:bg-wire-700 text-wire-900 dark:text-white shadow-sm"
                        : "text-wire-600 dark:text-wire-400"
                    }`}
                  >
                    Offsite Flow
                  </button>
                </div>
              </div>

              {/* Job Status Progression Stepper */}
              <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wire-900 dark:text-white">Job Status Progression</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    Stage: {jobStage.toUpperCase()}
                  </span>
                </div>

                {flowMode === "onsite" ? (
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {(["accepted", "on_the_way", "arrived", "in_service", "completed"] as const).map(
                      (st, idx) => {
                        const stagesArr = ["accepted", "on_the_way", "arrived", "in_service", "completed"];
                        const curIdx = stagesArr.indexOf(jobStage);
                        const isDone = idx <= curIdx;
                        const isCur = idx === curIdx;
                        const labels = ["1. Accepted", "2. On The Way", "3. Arrived", "4. In Service", "5. Completed"];

                        return (
                          <div
                            key={st}
                            className={`p-2.5 rounded-lg border transition ${
                              isCur
                                ? "border-2 border-wire-900 dark:border-white bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                                : isDone
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium"
                                : "border-wire-200 dark:border-wire-800 bg-wire-50 dark:bg-wire-900 text-wire-400"
                            }`}
                          >
                            <div className="font-bold">{labels[idx]}</div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {(["accepted", "arrived", "in_service", "completed"] as const).map((st, idx) => {
                      const stagesArr = ["accepted", "arrived", "in_service", "completed"];
                      const curIdx = stagesArr.indexOf(jobStage === "on_the_way" ? "arrived" : jobStage);
                      const isDone = idx <= curIdx;
                      const isCur = idx === curIdx;
                      const labels = ["1. Accepted", "2. Vehicle Received", "3. In Service", "4. Completed"];

                      return (
                        <div
                          key={st}
                          className={`p-2.5 rounded-lg border transition ${
                            isCur
                              ? "border-2 border-wire-900 dark:border-white bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold shadow-sm"
                              : isDone
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium"
                              : "border-wire-200 dark:border-wire-800 bg-wire-50 dark:bg-wire-900 text-wire-400"
                          }`}
                        >
                          <div className="font-bold">{labels[idx]}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-wire-200 dark:border-wire-800">
                  <span className="text-wire-500 text-xs">Update status as you travel and work so customer tracks progress live.</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setJobStage("in_service");
                        showToast("Stage updated: In Service / Work Started!");
                      }}
                      className="px-4 py-2 border border-wire-400 rounded-lg font-bold hover:bg-wire-100"
                    >
                      Mark "In Service"
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("m-log-service")}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                    >
                      Finish Job & Log Service ➔
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-12 gap-5">
                <div className="md:col-span-4 space-y-4">
                  <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                    <div className="text-[10px] font-mono uppercase text-wire-400">Customer Contact</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-wire-900 dark:text-white">Customer</div>
                        <div className="text-wire-500 font-mono text-[11px]">+91 98765 12345</div>
                      </div>
                      <a
                        href="tel:+919876512345"
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>

                    <div className="pt-3 border-t border-wire-200 dark:border-wire-700 space-y-1">
                      <div className="text-[10px] font-mono text-wire-400 uppercase">Vehicle Specifications</div>
                      <div className="font-bold text-wire-900 dark:text-white">Swift Dzire (White)</div>
                      <div className="flex justify-between text-wire-500 text-[11px]">
                        <span>Reg: <strong className="font-mono text-wire-800 dark:text-wire-200">KL-07-CC-1234</strong></span>
                        <span>Odometer: <strong className="font-mono text-wire-800 dark:text-wire-200">45,210 km</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-amber-300 dark:border-amber-800 rounded-xl p-4 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
                    <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                      <span>🛠️</span>
                      <span>Additional Inspection Actions</span>
                    </div>
                    <p className="text-wire-600 dark:text-wire-400 text-[11px]">
                      Found extra worn parts or need customer approval for additional repairs?
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSuggestModalOpen(true)}
                      className="w-full py-2.5 px-3 border border-amber-400 bg-white dark:bg-wire-800 rounded-lg font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-50 text-left flex items-center justify-between shadow-sm"
                    >
                      <span>💬 Suggest a Change / Add Price Quote</span>
                      <span>›</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-wire-900 dark:text-white">
                        Route to Breakdown Spot: Service Road, Near Overbridge #4
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast("🧭 Opening GPS coordinates in navigation...")}
                        className="px-3 py-1.5 border border-wire-300 rounded font-medium flex items-center gap-1 hover:bg-wire-100"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>GPS Nav</span>
                      </button>
                    </div>

                    <div className="p-4 bg-wire-50 dark:bg-wire-800 rounded-lg text-center font-mono text-wire-500">
                      [🗺️ Mini GPS Map Preview: 3.2 km distance • 8 mins ETA]
                    </div>

                    <div className="space-y-2 pt-2 border-t border-wire-200 dark:border-wire-700">
                      <div className="font-bold text-wire-900 dark:text-white">Customer Selected Checklist</div>
                      <div className="p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg flex items-center justify-between">
                        <span>✓ Battery Jumpstart & Alternator Charging Test</span>
                        <span className="font-mono font-bold">₹200 labor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. TAB: LOG SERVICE (ODOMETER, CHECKLIST, PARTS, INVOICE)                 */}
          {/* ========================================================================= */}
          {activeTab === "m-log-service" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white flex items-center gap-2">
                    <span>📝 Log Service & Generate Invoice</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                      FINALIZING
                    </span>
                  </h2>
                  <p className="text-xs text-wire-500">
                    Saving this log automatically updates the customer's permanent vehicle history and predicts next maintenance km.
                  </p>
                </div>
              </div>

              {/* MANDATORY ODOMETER READING (PROMINENT INPUT) */}
              <div className="border-2 border-wire-900 dark:border-white rounded-xl p-5 bg-wire-50 dark:bg-wire-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <h3 className="font-bold text-base text-wire-900 dark:text-white">
                      Current Vehicle Odometer Reading (Required) *
                    </h3>
                  </div>
                  <p className="text-xs text-wire-500 mt-0.5">
                    Verify against the instrument cluster. Last recorded: <strong>45,210 km</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={logOdometer}
                    onChange={(e) => setLogOdometer(e.target.value)}
                    required
                    className="w-36 px-3 py-2 text-base font-bold font-mono border-2 border-wire-900 dark:border-white rounded-lg bg-white dark:bg-wire-900 text-wire-900 dark:text-white text-right"
                  />
                  <span className="font-bold text-sm font-mono text-wire-700 dark:text-wire-300">KM</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-5">
                  {/* Checklist Completed */}
                  <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                    <div className="font-bold text-wire-900 dark:text-white text-sm">1. Work Completed Checklist</div>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                          <span className="font-medium text-wire-900 dark:text-white">Battery Jumpstart & Terminal Cleaning</span>
                        </div>
                        <span className="font-mono">₹200</span>
                      </label>
                      <label className="flex items-center justify-between p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                          <span className="font-medium text-wire-900 dark:text-white">Alternator Output & Belt Tension Check</span>
                        </div>
                        <span className="font-mono">₹150</span>
                      </label>
                    </div>
                  </div>

                  {/* Parts & Materials */}
                  <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-wire-900 dark:text-white text-sm">2. Replacement Parts & Consumables</div>
                      <button
                        type="button"
                        onClick={() => setIsAddPartModalOpen(true)}
                        className="px-2.5 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Part</span>
                      </button>
                    </div>

                    <table className="w-full text-left border-collapse border border-wire-200 dark:border-wire-700 rounded-lg overflow-hidden">
                      <thead className="bg-wire-50 dark:bg-wire-800 text-[10px] uppercase font-mono text-wire-500">
                        <tr>
                          <th className="p-2">Part Description</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2 text-right">Unit Price</th>
                          <th className="p-2 text-right">Subtotal</th>
                          <th className="p-2 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-wire-200 dark:divide-wire-700 font-mono text-[11px]">
                        {partsList.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-sans font-medium text-wire-900 dark:text-white">{p.name}</td>
                            <td className="p-2 text-center">{p.qty}</td>
                            <td className="p-2 text-right">₹{p.unitPrice}</td>
                            <td className="p-2 text-right font-bold">₹{p.unitPrice * p.qty}</td>
                            <td className="p-2 text-center text-wire-400 hover:text-red-600 cursor-pointer" onClick={() => handleRemovePart(idx)}>
                              ✕
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Extra Issues Found */}
                  <div className="border border-amber-300 dark:border-amber-800 rounded-xl p-4 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                        ⚠️ Extra Issues Found During Inspection
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        APPROVED BY CUSTOMER
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-wire-900 rounded-lg border border-amber-200 dark:border-amber-900/50 flex justify-between items-start">
                      <div>
                        <div className="font-bold text-wire-900 dark:text-white">Front Brake Pads Worn (2 mm remaining)</div>
                        <div className="text-wire-500 text-[11px]">Recommended replacement within 300 km. Customer approved pad inspection.</div>
                      </div>
                      <div className="text-right font-mono font-bold text-wire-900 dark:text-white">₹350</div>
                    </div>
                  </div>
                </div>

                {/* Right: Live Invoice Summary (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="border-2 border-wire-900 dark:border-white rounded-xl p-4 bg-white dark:bg-wire-850 space-y-4 shadow-sm sticky top-20">
                    <div className="border-b border-wire-200 dark:border-wire-800 pb-3">
                      <div className="text-[10px] font-mono uppercase text-wire-400">Invoice Preview</div>
                      <div className="font-bold text-base text-wire-900 dark:text-white">GearUp Service Receipt</div>
                      <div className="text-wire-500 text-[11px] font-mono">Invoice #INV-2026-9041</div>
                    </div>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="font-sans text-wire-600 dark:text-wire-400">Labor Charge</span>
                        <span className="text-wire-900 dark:text-white">₹{laborTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans text-wire-600 dark:text-wire-400">Parts & Materials</span>
                        <span className="text-wire-900 dark:text-white">₹{partsTotal}</span>
                      </div>
                      {flowMode === "onsite" && (
                        <div className="flex justify-between">
                          <span className="font-sans text-wire-600 dark:text-wire-400">Onsite Mobile Visit Fee</span>
                          <span className="text-wire-900 dark:text-white">₹{visitFee}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-sans text-wire-600 dark:text-wire-400">Taxes (GST 18% on Labor)</span>
                        <span className="text-wire-900 dark:text-white">₹{gstTax}</span>
                      </div>
                      <div className="pt-3 border-t-2 border-wire-900 dark:border-white flex justify-between items-baseline font-bold text-sm">
                        <span className="font-sans">Grand Total:</span>
                        <span className="text-emerald-600 text-base">₹{grandTotal}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveServiceLog}
                      className="w-full py-3 bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 shadow transition flex items-center justify-center gap-2"
                    >
                      <span>Finalize & Send Bill to Customer ✓</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. TAB: SERVICES & PRICES                                                 */}
          {/* ========================================================================= */}
          {activeTab === "m-services-prices" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Services & Transparent Price Catalog</h2>
                  <p className="text-xs text-wire-500">Configure your labor rates, parts inventory, visit charges, and service boundary.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPartModalOpen(true)}
                  className="px-3.5 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs"
                >
                  + Add Service / Part
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-wire-50 dark:bg-wire-850">
                <div>
                  <div className="font-bold text-wire-900 dark:text-white">Service Modes Accepted</div>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-wire-900" />
                      <span>🚐 Onsite</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-wire-900" />
                      <span>🏢 Offsite</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-wire-900 dark:text-white">Onsite Mobile Radius</div>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="number" defaultValue={15} className="w-16 px-2 py-1 border border-wire-300 rounded font-mono" />
                    <span className="text-wire-500">km from garage</span>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-wire-900 dark:text-white">Standard Visit Charge</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-wire-500">₹</span>
                    <input type="number" defaultValue={150} className="w-20 px-2 py-1 border border-wire-300 rounded font-mono" />
                    <span className="text-wire-500">per mobile call</span>
                  </div>
                </div>
              </div>

              <div className="border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-wire-50 dark:bg-wire-800 text-[10px] uppercase font-mono text-wire-500 border-b border-wire-200 dark:border-wire-700">
                    <tr>
                      <th className="p-3">Service Name</th>
                      <th className="p-3">Applicable Modes</th>
                      <th className="p-3">Est. Duration</th>
                      <th className="p-3 text-right">Labor Rate</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wire-200 dark:divide-wire-700">
                    <tr>
                      <td className="p-3 font-medium text-wire-900 dark:text-white">Engine Oil Flush & Filter Change</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-wire-100 dark:bg-wire-800 text-[10px]">Onsite + Offsite</span></td>
                      <td className="p-3 text-wire-500">30 mins</td>
                      <td className="p-3 text-right font-mono font-bold">₹350</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">Active</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-wire-900 dark:text-white">Brake Pad Replacement (Front Pair)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-wire-100 dark:bg-wire-800 text-[10px]">Onsite + Offsite</span></td>
                      <td className="p-3 text-wire-500">45 mins</td>
                      <td className="p-3 text-right font-mono font-bold">₹400</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">Active</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-wire-900 dark:text-white">Emergency Battery Jumpstart</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">Onsite Only</span></td>
                      <td className="p-3 text-wire-500">15 mins</td>
                      <td className="p-3 text-right font-mono font-bold">₹200</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">Active</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-wire-900 dark:text-white">Brake Rotor / Disc Skimming (Lathe)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px]">Offsite Only</span></td>
                      <td className="p-3 text-wire-500">2 hours</td>
                      <td className="p-3 text-right font-mono font-bold">₹850</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. TAB: SERVICE LOGS                                                      */}
          {/* ========================================================================= */}
          {activeTab === "m-service-logs" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Service History Logs</h2>
                  <p className="text-xs text-wire-500">Permanent record of all customer jobs, odometer records, and downloaded tax invoices.</p>
                </div>
              </div>

              <div className="border border-wire-300 dark:border-wire-700 rounded-xl overflow-hidden bg-white dark:bg-wire-850 shadow-sm p-4 space-y-3">
                <div className="p-3.5 bg-wire-50 dark:bg-wire-800 rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-wire-500">24 Aug 2026</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">🚐 ONSITE</span>
                    <span className="font-bold text-wire-900 dark:text-white">Customer (Swift Dzire • KL-07-CC-1234)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-wire-600">Odometer: <strong>40,120 km</strong></span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">₹2,450</span>
                    <button
                      type="button"
                      onClick={() => alert("📄 Downloading certified tax invoice #INV-2026-891...")}
                      className="px-2.5 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100 text-[11px]"
                    >
                      Download Invoice 📄
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-wire-50 dark:bg-wire-800 rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-wire-500">18 Aug 2026</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">🏢 OFFSITE</span>
                    <span className="font-bold text-wire-900 dark:text-white">Customer (Classic 350 • KL-07-AA-9988)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-wire-600">Odometer: <strong>38,000 km</strong></span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">₹850</span>
                    <button
                      type="button"
                      onClick={() => alert("📄 Downloading certified tax invoice #INV-2026-872...")}
                      className="px-2.5 py-1 border border-wire-300 rounded font-medium hover:bg-wire-100 text-[11px]"
                    >
                      Download Invoice 📄
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. TAB: REVIEWS                                                           */}
          {/* ========================================================================= */}
          {activeTab === "m-reviews" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Verified Customer Reviews</h2>
                  <p className="text-xs text-wire-500">Reviews are strictly submitted by customers after a completed, logged service.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                  4.9 Star Average (48 Reviews)
                </span>
              </div>

              <div className="space-y-3">
                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-wire-900 dark:text-white">Customer</span>
                        <span className="px-2 py-0.2 rounded bg-wire-100 text-[10px]">Swift Dzire</span>
                        <span className="text-emerald-600 font-bold text-[10px]">✓ Verified Service Completion</span>
                      </div>
                      <div className="text-amber-500 font-bold text-sm mt-0.5">★★★★★</div>
                    </div>
                    <span className="text-wire-400 font-mono text-[11px]">2 hours ago</span>
                  </div>
                  <p className="text-wire-700 dark:text-wire-300 leading-relaxed">
                    "Mechanic reached my office parking lot in 18 minutes with full mobile van tools. Battery jumpstart was clean, alternator voltage tested, and transparent receipt issued on the app."
                  </p>
                  <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg border-l-2 border-wire-900 dark:border-white text-[11px] space-y-1">
                    <div className="font-bold text-wire-900 dark:text-white">Workshop Reply:</div>
                    <p className="text-wire-600 dark:text-wire-400">
                      "Thank you for trusting GearUp! Happy to have you back on the road safely. Don't forget to get that alternator belt checked at your 50,000 km mark."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. TAB: EARNINGS                                                          */}
          {/* ========================================================================= */}
          {activeTab === "m-earnings" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Workshop Earnings & Payouts</h2>
                  <p className="text-xs text-wire-500">Transparent summary of labor, parts, visit charges, and weekly bank settlements.</p>
                </div>
                <div className="flex items-center gap-1 border border-wire-300 rounded-lg p-0.5 bg-wire-50 dark:bg-wire-800">
                  <button
                    onClick={() => setEarningsPeriod("today")}
                    className={`px-3 py-1 rounded font-bold transition ${
                      earningsPeriod === "today" ? "bg-white dark:bg-wire-700 shadow-sm" : "text-wire-600"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setEarningsPeriod("week")}
                    className={`px-3 py-1 rounded font-bold transition ${
                      earningsPeriod === "week" ? "bg-white dark:bg-wire-700 shadow-sm" : "text-wire-600"
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setEarningsPeriod("month")}
                    className={`px-3 py-1 rounded font-bold transition ${
                      earningsPeriod === "month" ? "bg-white dark:bg-wire-700 shadow-sm" : "text-wire-600"
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-1">
                  <div className="text-xs text-wire-500 font-medium">Total Payout ({earningsPeriod})</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
                    {earningsPeriod === "today" ? "₹4,250" : earningsPeriod === "week" ? "₹28,600" : "₹1,18,400"}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">Direct Bank Deposit scheduled for Monday</div>
                </div>

                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-1">
                  <div className="text-xs text-wire-500 font-medium">Jobs Completed</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">
                    {earningsPeriod === "today" ? "5 Jobs" : earningsPeriod === "week" ? "34 Jobs" : "142 Jobs"}
                  </div>
                  <div className="text-[10px] text-wire-500">Verified service history logs</div>
                </div>

                <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-4 bg-white dark:bg-wire-850 space-y-1">
                  <div className="text-xs text-wire-500 font-medium">Average Payout per Job</div>
                  <div className="text-2xl font-bold font-mono text-wire-900 dark:text-white">₹850</div>
                  <div className="text-[10px] text-emerald-600 font-bold">0% commission on emergency calls</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. TAB: AVAILABILITY                                                      */}
          {/* ========================================================================= */}
          {activeTab === "m-availability" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Shop Availability & Dispatch Rules</h2>
                  <p className="text-xs text-wire-500">Control when your garage accepts calls and configure smart auto-busy toggles.</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Preferences saved!")}
                  className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold"
                >
                  Save Preferences ✓
                </button>
              </div>

              <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 shadow-sm">
                <div className="font-bold text-sm text-wire-900 dark:text-white">Standard Weekly Working Hours</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg">
                    <span className="font-bold w-24">Mon - Fri</span>
                    <div className="flex items-center gap-2">
                      <input type="time" defaultValue="08:00" className="px-2 py-1 border rounded" />
                      <span>to</span>
                      <input type="time" defaultValue="20:00" className="px-2 py-1 border rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg">
                    <span className="font-bold w-24">Saturday</span>
                    <div className="flex items-center gap-2">
                      <input type="time" defaultValue="08:30" className="px-2 py-1 border rounded" />
                      <span>to</span>
                      <input type="time" defaultValue="18:00" className="px-2 py-1 border rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 border border-wire-200 dark:border-wire-700 rounded-lg bg-wire-50 dark:bg-wire-800">
                    <span className="font-bold w-24 text-wire-500">Sunday</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-wire-900" />
                      <span>Emergency breakdown dispatch only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. TAB: SHOP PROFILE                                                     */}
          {/* ========================================================================= */}
          {activeTab === "m-profile" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
                <div>
                  <h2 className="text-lg font-bold text-wire-900 dark:text-white">Workshop Profile & Credentials</h2>
                  <p className="text-xs text-wire-500">Public profile details shown to vehicle owners looking for nearby mechanics.</p>
                </div>
              </div>

              <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-6 bg-white dark:bg-wire-850 space-y-4 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-wire-100 dark:bg-wire-800 border-2 border-wire-900 dark:border-white mx-auto flex items-center justify-center text-2xl font-mono">
                  🔧
                </div>
                <div>
                  <h3 className="font-bold text-base text-wire-900 dark:text-white">Workshop Name #1</h3>
                  <p className="text-wire-500">Multi-Brand Car & Two-Wheeler Service Center</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    <span>✓</span>
                    <span>GEARUP VERIFIED PARTNER</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-wire-200 dark:border-wire-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  <div className="p-3 border rounded-lg bg-wire-50 dark:bg-wire-800">
                    <span className="text-[10px] text-wire-400 uppercase">Partner ID</span>
                    <div className="font-mono font-bold text-wire-900 dark:text-white">#MEC-7721</div>
                  </div>
                  <div className="p-3 border rounded-lg bg-wire-50 dark:bg-wire-800">
                    <span className="text-[10px] text-wire-400 uppercase">Rating</span>
                    <div className="font-bold text-wire-900 dark:text-white">4.9 ★ (48 jobs)</div>
                  </div>
                  <div className="p-3 border rounded-lg bg-wire-50 dark:bg-wire-800">
                    <span className="text-[10px] text-wire-400 uppercase">Member Since</span>
                    <div className="font-bold text-wire-900 dark:text-white">March 2025</div>
                  </div>
                  <div className="p-3 border rounded-lg bg-wire-50 dark:bg-wire-800">
                    <span className="text-[10px] text-wire-400 uppercase">Verification</span>
                    <div className="font-bold text-emerald-600">Active (Trade License OK)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Confirm Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-5 max-w-sm w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <span>⚠️</span>
              <span>Confirm Reject Request</span>
            </div>
            <p className="text-wire-600 dark:text-wire-400">
              Are you sure you want to pass on this customer? The request will be immediately routed to the next nearest mechanic.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 border border-wire-300 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-3 py-1.5 bg-red-600 text-white rounded font-bold hover:bg-red-700"
              >
                Confirm & Forward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirm Offline Modal */}
      {isOfflineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-5 max-w-sm w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <span>⚠️</span>
              <span>Go Offline Confirmation</span>
            </div>
            <p className="text-wire-600 dark:text-wire-400">
              You will stop receiving new breakdown alerts and customer search results. You have active/scheduled bookings.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfflineModalOpen(false)}
                className="px-3 py-1.5 border border-wire-300 rounded font-medium"
              >
                Keep Online
              </button>
              <button
                type="button"
                onClick={handleConfirmOffline}
                className="px-3 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold"
              >
                Go Offline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Suggest Change Modal */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-5 max-w-md w-full space-y-4 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
              <div className="font-bold text-sm text-wire-900 dark:text-white">Suggest a Change / Add Extra Price Quote</div>
              <button onClick={() => setIsSuggestModalOpen(false)} className="text-wire-400 text-base">✕</button>
            </div>
            <form onSubmit={handleSendQuote} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Issue Identified *</label>
                <input
                  type="text"
                  value={suggestIssue}
                  onChange={(e) => setSuggestIssue(e.target.value)}
                  className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Additional Labor (₹)</label>
                  <input
                    type="number"
                    value={suggestLabor}
                    onChange={(e) => setSuggestLabor(e.target.value)}
                    className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Est. Part Cost (₹)</label>
                  <input
                    type="number"
                    value={suggestPart}
                    onChange={(e) => setSuggestPart(e.target.value)}
                    className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="px-3 py-1.5 border border-wire-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800"
                >
                  Send Quote to Customer ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Part Modal */}
      {isAddPartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-5 max-w-sm w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
              <div className="font-bold text-sm text-wire-900 dark:text-white">Add Part / Consumable to Log</div>
              <button onClick={() => setIsAddPartModalOpen(false)} className="text-wire-400 text-base">✕</button>
            </div>
            <form onSubmit={handleAddPartToTable} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Part Name / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Synthetic Engine Oil 5W-30 (1L)"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(e.target.value)}
                    className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartModalOpen(false)}
                  className="px-3 py-1.5 border border-wire-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold"
                >
                  Add to Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 rounded-xl p-5 max-w-md w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
              <div className="font-bold text-sm text-wire-900 dark:text-white">Post Official Workshop Reply</div>
              <button onClick={() => setIsReplyModalOpen(false)} className="text-wire-400 text-base">✕</button>
            </div>
            <p className="text-wire-500 text-[11px]">
              Your reply will appear publicly under the customer's verified review on your GearUp workshop profile.
            </p>
            <div>
              <textarea
                rows={3}
                placeholder="Thank the customer for their business and provide maintenance tips..."
                className="w-full px-3 py-2 border border-wire-300 rounded bg-white dark:bg-wire-800 text-wire-900 dark:text-white"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="px-3 py-1.5 border border-wire-300 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  showToast("Reply published to verified customer review!");
                }}
                className="px-4 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold"
              >
                Post Reply ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MechanicDashboard() {
  return (
    <AuthGuard allowedRoles={["mechanic"]}>
      <MechanicDashboardContent />
    </AuthGuard>
  );
}
