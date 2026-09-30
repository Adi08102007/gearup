"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { Car, Gauge, Plus, Calendar, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Clock, MapPin, Wrench } from "lucide-react";

export default function CustomerDashboard() {
  const { vehicles, activeVehicle, setActiveVehicleId, updateVehicleKm, maintenanceTasks, bookings } = useApp();
  const [kmInput, setKmInput] = useState(activeVehicle.currentKm.toString());
  const [isEditingKm, setIsEditingKm] = useState(false);

  const vehicleBookings = bookings.filter((b) => b.vehicle.regNumber === activeVehicle.regNumber);
  const remainingKm = Math.max(0, activeVehicle.nextServiceDueKm - activeVehicle.currentKm);

  const handleKmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(kmInput, 10);
    if (!isNaN(val) && val >= 0) {
      updateVehicleKm(activeVehicle.id, val);
      setIsEditingKm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Vehicle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-blue-400">Customer Space</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Owner Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Vehicle Garage & Health Tracker</h1>
        </div>

        {/* Vehicle Selector + Add Button */}
        <div className="flex items-center gap-3">
          <select
            value={activeVehicle.id}
            onChange={(e) => {
              setActiveVehicleId(e.target.value);
              const selected = vehicles.find((v) => v.id === e.target.value);
              if (selected) setKmInput(selected.currentKm.toString());
            }}
            aria-label="Active Vehicle"
            className="bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} ({v.regNumber})
              </option>
            ))}
          </select>

          <Link
            href="/customer/add-vehicle"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Active Vehicle Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f1422] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {activeVehicle.regNumber}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </h2>
              <p className="text-sm text-slate-400">
                Fuel: <span className="text-slate-200 font-medium">{activeVehicle.fuelType}</span> • Pollution Valid: {activeVehicle.pollutionExpiry}
              </p>
            </div>

            {/* Health Score Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141b2d] border border-slate-800">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={activeVehicle.healthScore > 80 ? "#10b981" : "#f59e0b"}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * activeVehicle.healthScore) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-white">{activeVehicle.healthScore}%</span>
              </div>
              <div>
                <div className="text-xs text-slate-400">Health Index</div>
                <div className="text-sm font-semibold text-emerald-400">
                  {activeVehicle.healthScore > 80 ? "Optimal Condition" : "Service Advised"}
                </div>
              </div>
            </div>
          </div>

          {/* Odometer Tracker Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Last Service: {activeVehicle.lastServiceKm.toLocaleString()} km</span>
              <span className="font-semibold text-amber-400">
                {remainingKm === 0 ? "Service Overdue!" : `${remainingKm.toLocaleString()} km until next service`}
              </span>
              <span className="text-slate-400">Target: {activeVehicle.nextServiceDueKm.toLocaleString()} km</span>
            </div>

            {/* Progress line */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(5, ((activeVehicle.currentKm - activeVehicle.lastServiceKm) / (activeVehicle.nextServiceDueKm - activeVehicle.lastServiceKm)) * 100))}%`,
                }}
              />
            </div>

            {/* Current Odometer display & Quick Edit */}
            <div className="flex items-center justify-between pt-2">
              {isEditingKm ? (
                <form onSubmit={handleKmSubmit} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={kmInput}
                    onChange={(e) => setKmInput(e.target.value)}
                    className="bg-slate-900 border border-blue-500 text-white px-3 py-1 rounded-lg text-sm w-32 outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-medium rounded-lg text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingKm(false);
                      setKmInput(activeVehicle.currentKm.toString());
                    }}
                    className="px-2 py-1 bg-slate-800 text-xs text-slate-400 hover:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    Odometer: <strong className="text-white text-base font-mono">{activeVehicle.currentKm.toLocaleString()} km</strong>
                  </span>
                  <button
                    onClick={() => setIsEditingKm(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-medium ml-2"
                  >
                    Update km
                  </button>
                </div>
              )}

              <span className="text-xs text-slate-500 hidden sm:inline">Calculates component wear automatically</span>
            </div>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Service Actions</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select verified garages or request immediate highway recovery.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/customer/book"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 font-medium transition-all group"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Book Workshop Service</div>
                  <div className="text-[11px] text-slate-400">Garages nearby with upfront quotes</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/customer/sos"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-medium transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Emergency Crane Tow</div>
                  <div className="text-[11px] text-slate-400">Flatbed recovery dispatched in &lt;15m</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            🛡️ <strong className="text-slate-300">Zero Surge Guarantee:</strong> Recovery towing is charged at fixed ₹1,500 base + ₹65/km verified GPS fare.
          </div>
        </div>
      </div>

      {/* Active Service Bookings Section */}
      {vehicleBookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Current & Recent Garage Visits</span>
            </h2>
            <span className="text-xs text-slate-500">{vehicleBookings.length} booking(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicleBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{b.bookingNumber}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          b.status === "in_progress"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : b.status === "ready_for_pickup"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : b.status === "pending"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {b.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{b.shopName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Scheduled: {b.scheduledTime}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total</span>
                    <div className="text-base font-bold text-emerald-400 font-mono">
                      {formatCurrency(
                        b.laborCharge + (b.partsReplaced?.reduce((a, p) => a + p.cost, 0) || 0)
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl space-y-1.5 text-xs">
                  <div className="text-slate-400 font-medium">Selected Services:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {b.services.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {s.name}
                      </span>
                    ))}
                  </div>

                  {b.loggedOdometer && (
                    <div className="pt-2 text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Service Odometer Recorded: <strong>{b.loggedOdometer.toLocaleString()} km</strong></span>
                    </div>
                  )}

                  {b.completionOtp && (
                    <div className="pt-1 flex items-center justify-between text-slate-300">
                      <span>Pickup Verification OTP:</span>
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {b.completionOtp}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mileage-Based Component Health Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Mileage-Based Maintenance Schedule</h2>
            <p className="text-xs text-slate-400">Recommended intervals for {activeVehicle.make} {activeVehicle.model}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenanceTasks.map((task) => {
            const isDue = activeVehicle.currentKm >= task.dueKm - 2000;
            return (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {isDue ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-sm text-white">{task.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{task.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Interval: Every {task.intervalKm.toLocaleString()} km</span>
                    <span>•</span>
                    <span>Due at: {task.dueKm.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] text-slate-400">Est. Cost</span>
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {formatCurrency(task.estimatedCost)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
