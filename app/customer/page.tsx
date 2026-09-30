"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";
import { Calendar, AlertTriangle, ArrowRight, Plus } from "lucide-react";

function CustomerDashboardContent() {
  const router = useRouter();
  const { currentUser, vehicles, activeVehicle, updateVehicleKm, maintenanceTasks, bookings } = useApp();

  useEffect(() => {
    if (currentUser?.role === "mechanic") {
      router.replace("/mechanic");
    } else if (currentUser?.role === "crane") {
      router.replace("/crane");
    }
  }, [currentUser, router]);
  const [kmInput, setKmInput] = useState(activeVehicle ? activeVehicle.currentKm.toString() : "");
  const [isEditingKm, setIsEditingKm] = useState(false);

  const vehicleBookings = activeVehicle
    ? bookings.filter((b) => b.vehicle.regNumber === activeVehicle.regNumber)
    : [];

  const handleKmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;
    const val = parseInt(kmInput, 10);
    if (!isNaN(val) && val >= 0) {
      updateVehicleKm(activeVehicle.id, val);
      setIsEditingKm(false);
    }
  };

  const dueSoonTasks = maintenanceTasks.filter((t) => t.status === "due_soon" || t.status === "overdue");

  return (
    <div className="space-y-6">
      {/* 1. Maintenance Alert Strip (Shown only if user has a vehicle and an alert) */}
      {activeVehicle && dueSoonTasks.length > 0 && (
        <div className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300">MAINTENANCE ALERT:</span>
              <span className="text-wire-700 dark:text-wire-300 ml-1">
                {dueSoonTasks[0].title} is {dueSoonTasks[0].status === "overdue" ? "overdue" : "due soon"} for {activeVehicle.make} {activeVehicle.model}.
              </span>
            </div>
          </div>
          <Link
            href="/customer/book"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shadow-sm"
          >
            Book Now
          </Link>
        </div>
      )}

      {/* 2. Emergency Card on Dashboard */}
      <div className="border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold rounded uppercase">
              Emergency Mode
            </span>
            <span className="text-xs text-wire-500">Auto-detects GPS</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400">
            Vehicle broke down or need urgent roadside help?
          </h2>
          <p className="text-xs text-wire-600 dark:text-wire-400">
            Dispatch the nearest available mobile mechanic in 3 clicks or fewer.
          </p>
        </div>
        <Link
          href="/customer/sos"
          className="w-full md:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center gap-2 shrink-0 animate-emerg"
        >
          <span>🚨</span>
          <span>Emergency SOS</span>
        </Link>
      </div>

      {/* 3. Quick Actions (4 Grid Matching Wireframe 6) */}
      <div>
        <div className="text-xs font-mono uppercase text-wire-400 font-bold mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/customer/find-mechanic"
            className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 text-left space-y-2 group transition"
          >
            <div className="text-2xl">🔍</div>
            <div className="font-bold text-xs group-hover:underline text-wire-900 dark:text-white">Find Mechanic</div>
            <div className="text-[11px] text-wire-500 leading-normal">
              Choose Onsite or Offsite mode with transparent pricing & verified ratings.
            </div>
          </Link>

          <Link
            href="/customer/sos"
            className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 text-left space-y-2 group transition"
          >
            <div className="text-2xl">🏗️</div>
            <div className="font-bold text-xs group-hover:underline text-wire-900 dark:text-white">Need Crane</div>
            <div className="text-[11px] text-wire-500 leading-normal">
              Flatbed recovery directly to the nearest verified workshop.
            </div>
          </Link>

          <Link
            href="/customer/my-vehicles"
            className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 text-left space-y-2 group transition"
          >
            <div className="text-2xl">🚗</div>
            <div className="font-bold text-xs group-hover:underline text-wire-900 dark:text-white">My Vehicles</div>
            <div className="text-[11px] text-wire-500 leading-normal">
              Update current km & view km-based service intervals.
            </div>
          </Link>

          <Link
            href="/customer/history"
            className="p-4 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 hover:border-wire-500 text-left space-y-2 group transition"
          >
            <div className="text-2xl">📋</div>
            <div className="font-bold text-xs group-hover:underline text-wire-900 dark:text-white">History</div>
            <div className="text-[11px] text-wire-500 leading-normal">
              Itemized invoices, parts used, and upcoming services.
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* VEHICLE CARD (5 cols) */}
        <div className="lg:col-span-5">
          {!activeVehicle ? (
            /* EMPTY STATE: Shown when new user has no vehicle added yet */
            <div className="border-2 border-dashed border-wire-300 dark:border-wire-700 rounded-xl p-8 bg-white dark:bg-wire-850 text-center space-y-3 text-xs shadow-sm">
              <div className="w-12 h-12 rounded-full bg-wire-100 dark:bg-wire-800 flex items-center justify-center text-2xl mx-auto">
                🚗
              </div>
              <h3 className="font-bold text-sm text-wire-900 dark:text-white">No vehicle added yet</h3>
              <p className="text-wire-500 max-w-xs mx-auto leading-relaxed">
                Add your vehicle to enable odometer tracking, km-based maintenance alerts, and fast breakdown dispatch.
              </p>
              <Link
                href="/customer/add-vehicle"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Your Vehicle</span>
              </Link>
            </div>
          ) : (
            /* USER'S SAVED VEHICLE */
            <div className="border-2 border-wire-900 dark:border-wire-300 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 text-xs shadow-sm">
              <div className="flex items-start justify-between border-b border-wire-200 dark:border-wire-700 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-wire-100 dark:bg-wire-800 px-2 py-0.5 rounded font-bold text-wire-700 dark:text-wire-300">
                    Primary Vehicle
                  </span>
                  <h3 className="text-base font-bold mt-1 text-wire-900 dark:text-white">
                    {activeVehicle.make} {activeVehicle.model}
                  </h3>
                  <span className="text-wire-500 text-[11px] font-mono">
                    {activeVehicle.regNumber} • {activeVehicle.fuelType}
                  </span>
                </div>

                <div className="text-right">
                  {isEditingKm ? (
                    <form onSubmit={handleKmSubmit} className="flex flex-col items-end gap-1">
                      <input
                        type="number"
                        value={kmInput}
                        onChange={(e) => setKmInput(e.target.value)}
                        className="w-24 border border-wire-400 rounded px-1.5 py-0.5 font-mono text-xs text-right bg-transparent text-wire-900 dark:text-white"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button type="submit" className="px-1.5 py-0.5 bg-wire-900 text-white rounded text-[10px]">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingKm(false)}
                          className="px-1.5 py-0.5 border rounded text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="font-mono font-bold text-sm text-wire-900 dark:text-white">
                        {activeVehicle.currentKm.toLocaleString()} km
                      </div>
                      <button
                        onClick={() => {
                          setKmInput(activeVehicle.currentKm.toString());
                          setIsEditingKm(true);
                        }}
                        className="text-[10px] text-wire-500 underline hover:text-wire-800"
                      >
                        Update km
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Checklist dynamically calculated from user's vehicle */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] uppercase text-wire-400 font-bold">
                  Maintenance Status:
                </div>

                {maintenanceTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`p-2.5 border rounded-lg flex items-center justify-between ${
                      t.status === "due_soon"
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                        : t.status === "overdue"
                        ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                        : "border-wire-200 dark:border-wire-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-wire-900 dark:text-white">{t.title}</div>
                      <div className="text-[11px] text-wire-500">
                        {t.status === "overdue"
                          ? `overdue • Last: ${t.lastDoneKm.toLocaleString()} km`
                          : `due in ${(t.dueKm - activeVehicle.currentKm).toLocaleString()} km • Last: ${t.lastDoneKm.toLocaleString()} km`}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 border font-bold text-[10px] rounded flex items-center gap-1 ${
                          t.status === "due_soon"
                            ? "border-amber-500 text-amber-700 dark:text-amber-300"
                            : t.status === "overdue"
                            ? "border-red-500 text-red-700 dark:text-red-300"
                            : "border-emerald-500 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        <span>{t.status === "due_soon" ? "⚠️" : t.status === "overdue" ? "🚨" : "✓"}</span>
                        <span>{t.status === "due_soon" ? "Due soon" : t.status === "overdue" ? "Overdue" : "OK"}</span>
                      </span>
                      {t.status !== "good" && (
                        <Link
                          href="/customer/book"
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold"
                        >
                          Book
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/customer/my-vehicles"
                className="block w-full py-2 border border-wire-300 dark:border-wire-700 rounded text-center text-xs font-medium hover:bg-wire-50 dark:hover:bg-wire-800 transition"
              >
                Manage in My Vehicles ➔
              </Link>
            </div>
          )}
        </div>

        {/* RECENT BOOKINGS (7 cols) */}
        <div id="bookings" className="lg:col-span-7 border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
            <h3 className="font-bold text-sm text-wire-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Recent Bookings</span>
            </h3>
            <span className="text-xs text-wire-500">{vehicleBookings.length} booking(s)</span>
          </div>

          {vehicleBookings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-wire-300 dark:border-wire-700 rounded-xl text-wire-500 space-y-2">
              <p>No service bookings yet.</p>
              <Link
                href="/customer/find-mechanic"
                className="inline-block text-wire-900 dark:text-white underline font-bold"
              >
                Find a mechanic to schedule your first visit ›
              </Link>
            </div>
          ) : (
            vehicleBookings.map((b) => (
              <div
                key={b.id}
                className="border border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-wire-900 dark:text-white">
                      #{b.bookingNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-wire-700 dark:text-wire-300">
                    <strong>{b.shopName}</strong> • {b.services.map((s) => s.name).join(", ")}
                  </div>
                  <div className="text-wire-400 text-[11px]">
                    Scheduled: {b.scheduledTime}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {formatCurrency(b.laborCharge)}
                  </span>
                  {b.completionOtp && (
                    <span className="text-[10px] font-mono bg-wire-200 dark:bg-wire-800 px-2 py-0.5 rounded">
                      OTP: {b.completionOtp}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <CustomerDashboardContent />
    </AuthGuard>
  );
}
