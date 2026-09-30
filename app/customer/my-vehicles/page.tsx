"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { Plus, Car } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

function MyVehiclesContent() {
  const { vehicles, updateVehicleKm } = useApp();
  const [kmInputs, setKmInputs] = useState<Record<string, string>>({});

  const handleUpdate = (vehicleId: string) => {
    const val = parseInt(kmInputs[vehicleId] || "", 10);
    if (!isNaN(val) && val >= 0) {
      updateVehicleKm(vehicleId, val);
      alert(`✅ Odometer updated to ${val.toLocaleString()} km. Predictive maintenance intervals recalculated.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-wire-300 dark:border-wire-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/customer"
              className="p-1 border border-wire-300 dark:border-wire-700 rounded text-xs hover:bg-wire-100"
            >
              ‹ Dashboard
            </Link>
            <h1 className="text-xl font-bold text-wire-900 dark:text-white">My Vehicles</h1>
          </div>
          <p className="text-xs text-wire-500 mt-1">
            Manage vehicle cards, update current km, and track maintenance alerts per item.
          </p>
        </div>

        <Link
          href="/customer/add-vehicle"
          className="px-3.5 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </Link>
      </div>

      {/* Empty State when no vehicles exist */}
      {vehicles.length === 0 ? (
        <div className="p-8 sm:p-12 border-2 border-dashed border-wire-300 dark:border-wire-700 rounded-2xl text-center space-y-4 bg-white dark:bg-wire-900 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-wire-100 dark:bg-wire-800 flex items-center justify-center text-wire-500">
            <Car className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-wire-900 dark:text-white">No vehicle added yet.</h2>
            <p className="text-xs text-wire-500">
              Add your car or two-wheeler to track maintenance schedules, odometer intervals, and book repairs.
            </p>
          </div>
          <Link
            href="/customer/add-vehicle"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add your vehicle</span>
          </Link>
        </div>
      ) : (
        /* Vehicle Cards Grid (Matches Wireframe 7) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((v, idx) => (
            <div
              key={v.id}
              className={`border-2 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 ${
                idx === 0
                  ? "border-wire-900 dark:border-wire-300 shadow-sm"
                  : "border-wire-300 dark:border-wire-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded uppercase ${
                        idx === 0
                          ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold"
                          : "bg-wire-200 dark:bg-wire-700 text-wire-800 dark:text-wire-200"
                      }`}
                    >
                      {idx === 0 ? "Primary" : "Secondary"}
                    </span>
                    <span className="font-mono font-bold text-sm text-wire-900 dark:text-white">
                      {v.regNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-1 text-wire-900 dark:text-white">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <span className="text-xs text-wire-500">
                    {v.fuelType} • 4-Wheeler • Pollution: {v.pollutionExpiry}
                  </span>
                </div>

                {/* Wireframe thumbnail placeholder box */}
                <div className="w-12 h-12 wireframe-box wireframe-cross rounded flex items-center justify-center text-xs text-wire-400 font-mono">
                  [🚗]
                </div>
              </div>

              {/* Current Odometer Bar with Update button */}
              <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-wire-400">Current Odometer</div>
                  <div className="font-mono font-bold text-sm text-wire-900 dark:text-white">
                    {v.currentKm.toLocaleString()} km
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="New km"
                    defaultValue={v.currentKm}
                    onChange={(e) => setKmInputs({ ...kmInputs, [v.id]: e.target.value })}
                    className="w-28 border border-wire-300 dark:border-wire-600 rounded px-2 py-1 text-xs bg-white dark:bg-wire-900 font-mono text-wire-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate(v.id)}
                    className="px-2.5 py-1 bg-wire-800 text-white rounded text-xs font-medium hover:bg-wire-700"
                  >
                    Update km
                  </button>
                </div>
              </div>

              {/* Component Service Intervals dynamically calculated from saved km */}
              <div className="space-y-2 text-xs">
                <div className="font-mono text-[11px] uppercase text-wire-400 font-bold">
                  Component Service Intervals:
                </div>

                <div className="p-2 border border-wire-200 dark:border-wire-700 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-wire-900 dark:text-white">Oil change:</span>
                    <span className="text-wire-600 dark:text-wire-400 ml-1">
                      {v.currentKm >= v.nextServiceDueKm
                        ? `overdue by ${(v.currentKm - v.nextServiceDueKm).toLocaleString()} km`
                        : `due in ${(v.nextServiceDueKm - v.currentKm).toLocaleString()} km`}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 border font-bold text-[10px] rounded flex items-center gap-1 ${
                      v.currentKm >= v.nextServiceDueKm
                        ? "border-red-500 text-red-700 dark:text-red-300"
                        : v.nextServiceDueKm - v.currentKm <= 500
                        ? "border-amber-500 text-amber-700 dark:text-amber-300"
                        : "border-emerald-500 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {v.currentKm >= v.nextServiceDueKm ? "🚨 Overdue" : v.nextServiceDueKm - v.currentKm <= 500 ? "⚠️ Due soon" : "✓ OK"}
                  </span>
                </div>

                <div className="p-2 border border-wire-200 dark:border-wire-700 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-wire-900 dark:text-white">Brake pads:</span>
                    <span className="text-wire-600 dark:text-wire-400 ml-1">
                      due in ~4,000 km (Inspection recommended)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded flex items-center gap-1">
                    <span>✓</span> OK
                  </span>
                </div>

                <div className="p-2 border border-wire-200 dark:border-wire-700 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-wire-900 dark:text-white">Brake fluid flush:</span>
                    <span className="text-wire-600 dark:text-wire-400 ml-1">
                      {v.currentKm >= 35000 ? "Moisture inspection due" : "Optimal condition"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 border font-bold text-[10px] rounded flex items-center gap-1 ${
                      v.currentKm >= 35000
                        ? "border-amber-500 text-amber-700 dark:text-amber-300"
                        : "border-emerald-500 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {v.currentKm >= 35000 ? "⚠️ Due soon" : "✓ OK"}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-wire-200 dark:border-wire-700 flex gap-2 text-xs">
                <Link
                  href="/customer/book"
                  className="flex-1 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-center hover:opacity-90"
                >
                  Book Service
                </Link>
                <Link
                  href="/customer/history"
                  className="px-3 py-2 border border-wire-300 dark:border-wire-700 rounded hover:bg-wire-100 text-center"
                >
                  Service History
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyVehiclesPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <MyVehiclesContent />
    </AuthGuard>
  );
}
