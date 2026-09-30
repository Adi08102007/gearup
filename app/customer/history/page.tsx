"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { FileText, Printer, Star, Download, RotateCcw, Car, Wrench } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

function ServiceHistoryContent() {
  const { activeVehicle, bookings } = useApp();
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(activeVehicle?.regNumber || "");

  if (!activeVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-wire-300 dark:border-wire-700 pb-4">
          <Link
            href="/customer"
            className="p-1 border border-wire-300 dark:border-wire-700 rounded text-xs hover:bg-wire-100"
          >
            ‹ Dashboard
          </Link>
          <h1 className="text-xl font-bold text-wire-900 dark:text-white">Service History</h1>
        </div>

        <div className="p-8 sm:p-12 border-2 border-dashed border-wire-300 dark:border-wire-700 rounded-2xl text-center space-y-4 bg-white dark:bg-wire-900 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-wire-100 dark:bg-wire-800 flex items-center justify-center text-wire-500">
            <Car className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-wire-900 dark:text-white">No vehicle added yet.</h2>
            <p className="text-xs text-wire-500">
              Please add your vehicle first to track its certified service history and parts ledger.
            </p>
          </div>
          <Link
            href="/customer/add-vehicle"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-sm"
          >
            <span>Add your vehicle</span>
          </Link>
        </div>
      </div>
    );
  }

  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="space-y-6">
      {/* Top Header with Vehicle Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-wire-300 dark:border-wire-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/customer"
              className="p-1 border border-wire-300 dark:border-wire-700 rounded text-xs hover:bg-wire-100"
            >
              ‹ Dashboard
            </Link>
            <h1 className="text-xl font-bold text-wire-900 dark:text-white">Service History</h1>
            <span className="font-mono text-xs px-2 py-0.5 border border-wire-300 dark:border-wire-700 rounded bg-wire-50 dark:bg-wire-800 font-bold">
              {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber})
            </span>
          </div>
          <p className="text-xs text-wire-500 mt-1">
            Itemized service audit trail, parts ledger, and km-based upcoming services.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => alert("📄 Exporting certified digital vehicle history PDF.")}
            className="px-3 py-1.5 border border-wire-400 rounded flex items-center gap-1.5 hover:bg-wire-100"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Full History</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-wire-400 rounded flex items-center gap-1.5 hover:bg-wire-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Total Services</span>
          <div className="text-lg font-bold text-wire-900 dark:text-white">
            {completedBookings.length} {completedBookings.length === 1 ? "Service" : "Services"}
          </div>
          <div className="text-[11px] text-wire-500">Recorded on GearUp</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Total Spent</span>
          <div className="text-lg font-bold font-mono text-emerald-600">
            ₹{completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-wire-500">Labor + OEM Parts</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Last Service Km</span>
          <div className="text-lg font-bold font-mono text-wire-900 dark:text-white">
            {activeVehicle.lastServiceKm.toLocaleString()} km
          </div>
          <div className="text-[11px] text-wire-500">Verified Workshop Log</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Current Odometer</span>
          <div className="text-lg font-bold font-mono text-wire-900 dark:text-white">
            {activeVehicle.currentKm.toLocaleString()} km
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">Saved km</div>
        </div>
      </div>

      {/* Next-Service Predictions Section */}
      <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
          <span className="font-mono font-bold uppercase text-wire-500 text-[11px]">
            Upcoming Next-Service Predictions (Due in km)
          </span>
          <span className="text-wire-400 font-mono">Current odometer: {activeVehicle.currentKm.toLocaleString()} km</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border-2 border-amber-500 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between">
            <div>
              <div className="font-bold text-amber-800 dark:text-amber-300">Oil change & filter</div>
              <div className="text-[11px] text-wire-600 dark:text-wire-400 mt-0.5">
                {activeVehicle.currentKm >= activeVehicle.nextServiceDueKm
                  ? `overdue by ${(activeVehicle.currentKm - activeVehicle.nextServiceDueKm).toLocaleString()} km`
                  : `due in ${(activeVehicle.nextServiceDueKm - activeVehicle.currentKm).toLocaleString()} km`}
              </div>
            </div>
            <Link
              href="/customer/book"
              className="mt-2.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] text-center"
            >
              Book Service
            </Link>
          </div>

          <div className="p-3 border border-wire-300 dark:border-wire-700 rounded-lg flex flex-col justify-between">
            <div>
              <div className="font-bold text-wire-900 dark:text-white">Brake pads inspection</div>
              <div className="text-[11px] text-wire-500 mt-0.5">due in <strong>~4,200 km</strong> (OK)</div>
            </div>
            <Link
              href="/customer/book"
              className="mt-2.5 px-3 py-1.5 border border-wire-400 rounded text-[11px] text-center hover:bg-wire-100"
            >
              Book Ahead
            </Link>
          </div>

          <div className="p-3 border border-wire-300 dark:border-wire-700 rounded-lg flex flex-col justify-between">
            <div>
              <div className="font-bold text-wire-900 dark:text-white">Coolant / Fluid flush</div>
              <div className="text-[11px] text-wire-500 mt-0.5">
                {activeVehicle.currentKm >= 35000 ? "Due for inspection" : "Optimal condition"}
              </div>
            </div>
            <Link
              href="/customer/book"
              className="mt-2.5 px-3 py-1.5 border border-wire-400 rounded text-[11px] text-center hover:bg-wire-100"
            >
              Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-4 text-xs">
        <div className="font-mono font-bold text-xs uppercase text-wire-500 border-b border-wire-300 dark:border-wire-700 pb-1">
          Certified Service Logs
        </div>

        {completedBookings.length === 0 ? (
          <div className="p-8 border border-wire-200 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 text-center space-y-2">
            <Wrench className="w-8 h-8 mx-auto text-wire-400" />
            <div className="font-bold text-wire-900 dark:text-white text-sm">No completed service records yet</div>
            <p className="text-xs text-wire-500">
              When a verified workshop completes service on your vehicle and logs the odometer, the itemized invoice and mechanic checklist will appear here.
            </p>
          </div>
        ) : (
          completedBookings.map((b) => (
            <div
              key={b.id}
              className="border-2 border-wire-900 dark:border-wire-300 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-wire-900 dark:text-white">
                    {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="px-2 py-0.5 border border-wire-400 rounded text-[10px] uppercase font-bold text-wire-700 dark:text-wire-300">
                    {b.serviceType === "onsite" ? "🚐 Onsite" : "🏢 Offsite"}
                  </span>
                  <span className="font-bold text-wire-900 dark:text-white">{b.shopName}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span>Odometer: <strong>{b.odometerAtService ? `${b.odometerAtService.toLocaleString()} km` : "Recorded"}</strong></span>
                  <span className="text-sm font-bold text-emerald-600">Total: ₹{b.totalAmount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-wire-200 dark:border-wire-700 space-y-3 text-wire-600 dark:text-wire-300">
                <div>
                  <span className="font-bold text-wire-900 dark:text-white">Checklist items:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {b.services.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 bg-wire-100 dark:bg-wire-800 rounded text-[11px]">
                        ✓ {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-wire-200 dark:border-wire-700">
                  <button
                    onClick={() => alert("📄 Downloading digital invoice...")}
                    className="px-3.5 py-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>
                  <Link
                    href={`/customer/book?shop=${b.shopId}`}
                    className="px-3.5 py-1.5 border border-wire-400 rounded font-bold text-xs flex items-center gap-1.5 hover:bg-wire-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Book Again</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ServiceHistoryPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <ServiceHistoryContent />
    </AuthGuard>
  );
}
