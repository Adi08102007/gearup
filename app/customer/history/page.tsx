"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { FileText, Printer, Search, Star, Download, RotateCcw } from "lucide-react";

export default function ServiceHistoryPage() {
  const { activeVehicle, bookings } = useApp();
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(activeVehicle.regNumber);
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div className="space-y-6">
      {/* Top Header with Vehicle Selector inside page content (Matches Wireframe 14) */}
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
            <select
              value={selectedVehicleReg}
              onChange={(e) => setSelectedVehicleReg(e.target.value)}
              className="border border-wire-300 dark:border-wire-600 rounded px-2.5 py-1 text-xs bg-white dark:bg-wire-800 font-bold text-wire-900 dark:text-white"
            >
              <option value={activeVehicle.regNumber}>
                🚗 {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber})
              </option>
            </select>
          </div>
          <p className="text-xs text-wire-500 mt-1">
            Itemized service audit trail, parts ledger, and km-based upcoming services.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => alert("📄 Exporting complete certified vehicle history PDF.")}
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

      {/* 4 Summary Cards (Matches Wireframe 14) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Total Services</span>
          <div className="text-lg font-bold text-wire-900 dark:text-white">8 Services</div>
          <div className="text-[11px] text-wire-500">Over 24 months</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Total Spent</span>
          <div className="text-lg font-bold font-mono text-emerald-600">₹14,850</div>
          <div className="text-[11px] text-wire-500">Labor + OEM Parts</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Last Service Date</span>
          <div className="text-lg font-bold text-wire-900 dark:text-white">24 Aug 2026</div>
          <div className="text-[11px] text-wire-500">Apex Auto Precision</div>
        </div>

        <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-xl bg-white dark:bg-wire-850 space-y-1">
          <span className="text-wire-400 font-mono uppercase text-[10px]">Current km</span>
          <div className="text-lg font-bold font-mono text-wire-900 dark:text-white">
            {activeVehicle.currentKm.toLocaleString()} km
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">Updated today</div>
        </div>
      </div>

      {/* Next-Service Predictions Section (Due in km format with Book button) */}
      <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
          <span className="font-mono font-bold uppercase text-wire-500 text-[11px]">
            Upcoming Next-Service Predictions (Due in km)
          </span>
          <span className="text-wire-400">Current odometer: {activeVehicle.currentKm.toLocaleString()} km</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border-2 border-amber-500 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between">
            <div>
              <div className="font-bold text-amber-800 dark:text-amber-300">Oil change & filter</div>
              <div className="text-[11px] text-wire-600 dark:text-wire-400 mt-0.5">
                due in <strong>250 km</strong> (Due soon)
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
              <div className="text-[11px] text-wire-500 mt-0.5">due in <strong>4,200 km</strong> (OK)</div>
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
              <div className="font-bold text-wire-900 dark:text-white">Coolant replacement</div>
              <div className="text-[11px] text-wire-500 mt-0.5">due in <strong>9,500 km</strong> (OK)</div>
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

      {/* Timeline Grouped by Month */}
      <div className="space-y-4 text-xs">
        <div className="font-mono font-bold text-xs uppercase text-wire-500 border-b border-wire-300 dark:border-wire-700 pb-1">
          August 2026
        </div>

        {/* Detailed Expanded Entry (Matches Wireframe 14) */}
        <div className="border-2 border-wire-900 dark:border-wire-300 rounded-xl p-5 bg-white dark:bg-wire-850 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-sm text-wire-900 dark:text-white">24 Aug 2026</span>
              <span className="px-2 py-0.5 border border-wire-400 rounded text-[10px] uppercase font-bold text-wire-700 dark:text-wire-300">
                🚐 Onsite
              </span>
              <span className="font-bold text-wire-900 dark:text-white">Apex Auto Precision & Diagnostics</span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span>Odometer: <strong>40,120 km</strong></span>
              <span className="text-sm font-bold text-emerald-600">Total: ₹2,450</span>
            </div>
          </div>

          {/* Expanded Breakdown */}
          <div className="pt-3 border-t border-wire-200 dark:border-wire-700 space-y-3 text-wire-600 dark:text-wire-300">
            <div>
              <span className="font-bold text-wire-900 dark:text-white">Checklist items done:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 bg-wire-100 dark:bg-wire-800 rounded text-[11px]">
                  ✓ Full Synthetic Oil Flush
                </span>
                <span className="px-2 py-0.5 bg-wire-100 dark:bg-wire-800 rounded text-[11px]">
                  ✓ OEM Oil Filter Replacement
                </span>
                <span className="px-2 py-0.5 bg-wire-100 dark:bg-wire-800 rounded text-[11px]">
                  ✓ Multi-point Inspection
                </span>
              </div>
            </div>

            <div className="border border-wire-200 dark:border-wire-700 rounded p-2.5 bg-wire-50 dark:bg-wire-800/40">
              <div className="font-bold text-[11px] mb-1 text-wire-900 dark:text-white">
                Parts used with unit price:
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>• Synthetic Oil 5W-30 (3.5L @ ₹450/L):</span>
                  <span>₹1,575</span>
                </div>
                <div className="flex justify-between">
                  <span>• OEM Oil Filter #FL-102:</span>
                  <span>₹325</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] p-2.5 bg-wire-100 dark:bg-wire-800 rounded">
              <div>Labor cost: <strong>₹400</strong></div>
              <div>Visit charge (Onsite): <strong>₹150</strong></div>
              <div>Crane fare: <strong>₹0 (None)</strong></div>
              <div className="text-emerald-600 font-bold">Total Billed: ₹2,450</div>
            </div>

            <div>
              <span className="font-bold text-wire-900 dark:text-white">Notes from mechanic:</span>
              <p className="text-[11px] italic">
                &ldquo;Engine drained cleanly. Front brake pads are worn to ~4mm; plan replacement at next 45,000 km service.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-wire-900 dark:text-white">Rating given:</span>
              <span className="text-amber-500 font-bold">★★★★★</span>
              <span className="text-[11px]">&ldquo;Prompt arrival and clear explanations.&rdquo;</span>
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
                href="/customer/book"
                className="px-3.5 py-1.5 border border-wire-400 rounded font-bold text-xs flex items-center gap-1.5 hover:bg-wire-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Again</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
