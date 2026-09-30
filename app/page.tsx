"use client";

import Link from "next/link";
import { ArrowRight, Wrench, ShieldAlert, Truck, Star, Search, Clock, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 py-2">
      {/* 1. Hero Section (Matches Wireframe Screen 1) */}
      <div className="p-6 md:p-12 border border-wire-300 dark:border-wire-700 rounded-2xl bg-wire-50/50 dark:bg-wire-900/30 space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-2.5 py-1 text-xs font-mono border border-wire-300 dark:border-wire-700 rounded bg-white dark:bg-wire-800 text-wire-700 dark:text-wire-300">
            [WIREFRAME] Responsive Automotive Platform • GearUp Ecosystem
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-wire-900 dark:text-white leading-tight">
            Find a trusted, rated mechanic near you.
          </h1>

          <p className="text-sm sm:text-base text-wire-600 dark:text-wire-300 leading-relaxed">
            Book doorstep onsite service, schedule workshop visits, or request emergency roadside towing with real-time tracking and transparent part & labor prices.
          </p>

          {/* Search Box */}
          <div className="p-4 bg-white dark:bg-wire-800 border-2 border-wire-900 dark:border-wire-300 rounded-xl shadow-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-wire-500">1. Current Location</label>
                <div className="flex items-center border border-wire-300 dark:border-wire-600 rounded px-2.5 py-2 text-xs bg-transparent">
                  <span className="mr-2">📍</span>
                  <input
                    type="text"
                    defaultValue="Kochi Central / NH 66 Bypass"
                    className="w-full bg-transparent focus:outline-none text-wire-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-wire-500">2. Service Needed</label>
                <select className="w-full border border-wire-300 dark:border-wire-600 rounded px-2.5 py-2 text-xs bg-white dark:bg-wire-800 text-wire-900 dark:text-white">
                  <option>General Service & Oil Change</option>
                  <option>Brake / Clutch Inspection</option>
                  <option>Battery Jumpstart / Replace</option>
                  <option>Flat Tyre / Puncture Repair</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-wire-500">3. Action</label>
                <Link
                  href="/customer/find-mechanic"
                  className="w-full py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5 h-[34px]"
                >
                  <span>Find Mechanics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Breakdown Banner Card */}
            <div className="mt-4 pt-3 border-t border-wire-200 dark:border-wire-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border border-red-300 dark:border-red-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-emerg">🚨</span>
                <div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-400">
                    VEHICLE BROKE DOWN? GET HELP NOW
                  </div>
                  <div className="text-[11px] text-wire-600 dark:text-wire-400">
                    Emergency auto-dispatch to the nearest available technician in ≤ 3 clicks.
                  </div>
                </div>
              </div>
              <Link
                href="/customer/sos"
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded uppercase tracking-wider transition whitespace-nowrap shadow-sm"
              >
                Vehicle broke down? Get help now ➔
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How GearUp Works (3 Steps) */}
      <div className="p-6 md:p-10 border border-wire-300 dark:border-wire-700 rounded-2xl bg-white dark:bg-wire-900 space-y-6">
        <h2 className="text-lg font-bold uppercase font-mono tracking-wider text-center text-wire-900 dark:text-white">
          How GearUp Works (In 3 Simple Steps)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-wire-300 dark:border-wire-700 p-5 rounded-xl bg-wire-50 dark:bg-wire-800/40 space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-wire-900 dark:border-white font-mono font-bold flex items-center justify-center text-wire-900 dark:text-white">
              1
            </div>
            <h3 className="font-bold text-sm text-wire-900 dark:text-white">Select Issue or Breakdown</h3>
            <p className="text-xs text-wire-600 dark:text-wire-400 leading-relaxed">
              Choose from verified service checklists, add custom symptoms, and choose onsite or shop visit.
            </p>
          </div>

          <div className="border border-wire-300 dark:border-wire-700 p-5 rounded-xl bg-wire-50 dark:bg-wire-800/40 space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-wire-900 dark:border-white font-mono font-bold flex items-center justify-center text-wire-900 dark:text-white">
              2
            </div>
            <h3 className="font-bold text-sm text-wire-900 dark:text-white">Matched With Rated Mechanics</h3>
            <p className="text-xs text-wire-600 dark:text-wire-400 leading-relaxed">
              View real-time availability badges, distance, upfront part rates, and verified customer reviews.
            </p>
          </div>

          <div className="border border-wire-300 dark:border-wire-700 p-5 rounded-xl bg-wire-50 dark:bg-wire-800/40 space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-wire-900 dark:border-white font-mono font-bold flex items-center justify-center text-wire-900 dark:text-white">
              3
            </div>
            <h3 className="font-bold text-sm text-wire-900 dark:text-white">Live Tracking & Service History</h3>
            <p className="text-xs text-wire-600 dark:text-wire-400 leading-relaxed">
              Track technician ETA on live map, approve extra parts in-app, and log service into vehicle history.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 5 Features Grid */}
      <div className="p-6 md:p-8 border border-wire-300 dark:border-wire-700 rounded-2xl bg-white dark:bg-wire-900 space-y-4">
        <h2 className="text-lg font-bold uppercase font-mono tracking-wider text-wire-900 dark:text-white">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl space-y-1">
            <div className="text-red-600 font-bold">🚨 Emergency Mode</div>
            <p className="text-wire-500">Instant dispatch and automatic 2-minute failover.</p>
          </div>
          <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl space-y-1">
            <div className="font-bold text-wire-900 dark:text-white">🚗 Onsite / Offsite</div>
            <p className="text-wire-500">Mobile service van at your door or shop visit.</p>
          </div>
          <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl space-y-1">
            <div className="font-bold text-wire-900 dark:text-white">🏗️ Crane Recovery</div>
            <p className="text-wire-500">Towing directly to the nearest verified garage.</p>
          </div>
          <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl space-y-1">
            <div className="font-bold text-wire-900 dark:text-white">📊 Service History</div>
            <p className="text-wire-500">Digital logbook with km-based maintenance alerts.</p>
          </div>
          <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl space-y-1">
            <div className="font-bold text-wire-900 dark:text-white">💰 Transparent Prices</div>
            <p className="text-wire-500">Itemized part prices and labor charges upfront.</p>
          </div>
        </div>
      </div>

      {/* 4. Quick Portal Switcher Banner (For Evaluators & Operators) */}
      <div className="p-4 rounded-xl border border-wire-300 dark:border-wire-700 bg-wire-100 dark:bg-wire-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <div className="font-bold text-wire-900 dark:text-white">Are you a Garage Owner or Crane Fleet Operator?</div>
          <div className="text-wire-500">Log into your specialized operations dispatch board.</div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/mechanic"
            className="px-3.5 py-1.5 border border-wire-400 dark:border-wire-600 rounded bg-white dark:bg-wire-800 font-bold text-wire-900 dark:text-white hover:bg-wire-50"
          >
            🛠️ Mechanic Portal ›
          </Link>
          <Link
            href="/crane"
            className="px-3.5 py-1.5 border border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded font-bold hover:bg-amber-500/20"
          >
            🏗️ Crane Ops ›
          </Link>
        </div>
      </div>
    </div>
  );
}
