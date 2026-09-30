"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { Star, MapPin, Clock, Wrench, ArrowRight, ShieldCheck, Filter, ArrowLeft } from "lucide-react";

export default function FindMechanicPage() {
  const router = useRouter();
  const { shops } = useApp();

  // Mode Step: 'unselected' | 'onsite' | 'offsite'
  const [selectedMode, setSelectedMode] = useState<"onsite" | "offsite" | null>(null);
  const [isModeConfirmed, setIsModeConfirmed] = useState(false);

  // Filters
  const [minRating, setMinRating] = useState<number>(4.0);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShops = shops.filter((shop) => {
    if (availableOnly && !shop.isOpenNow) return false;
    if (shop.rating < minRating) return false;
    if (shop.distanceKm > maxDistance) return false;
    if (searchQuery && !shop.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-wire-300 dark:border-wire-700">
        <div className="flex items-center gap-3">
          <Link
            href="/customer"
            className="p-1.5 border border-wire-300 dark:border-wire-700 rounded hover:bg-wire-200 dark:hover:bg-wire-800 text-xs"
          >
            ‹ Dashboard
          </Link>
          <div>
            <h1 className="text-xl font-bold text-wire-900 dark:text-white">Find Mechanic</h1>
            <p className="text-xs text-wire-500">
              {isModeConfirmed
                ? `Showing verified mechanics for ${selectedMode === "onsite" ? "Onsite Mobile Service" : "Offsite Garage Visit"}`
                : "Step 1 of 2: Select service delivery mode"}
            </p>
          </div>
        </div>

        {isModeConfirmed && (
          <div className="flex items-center bg-wire-200 dark:bg-wire-800 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedMode("onsite")}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                selectedMode === "onsite"
                  ? "bg-white dark:bg-wire-900 font-bold shadow-sm text-wire-900 dark:text-white"
                  : "text-wire-600 dark:text-wire-400 hover:text-wire-900"
              }`}
            >
              <span>🚐</span>
              <span>Onsite</span>
            </button>
            <button
              onClick={() => setSelectedMode("offsite")}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                selectedMode === "offsite"
                  ? "bg-white dark:bg-wire-900 font-bold shadow-sm text-wire-900 dark:text-white"
                  : "text-wire-600 dark:text-wire-400 hover:text-wire-900"
              }`}
            >
              <span>🏢</span>
              <span>Offsite</span>
            </button>
          </div>
        )}
      </div>

      {/* STEP 1: CHOOSE SERVICE MODE (UNSELECTED BY DEFAULT, BUTTON DISABLED UNTIL CHOSEN) */}
      {!isModeConfirmed ? (
        <div className="max-w-2xl mx-auto py-6 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase text-wire-500">Find Mechanic • Step 1 of 2</span>
            <h2 className="text-2xl font-bold text-wire-900 dark:text-white">Choose Service Mode</h2>
            <p className="text-xs text-wire-500">
              Please choose whether you want the mechanic to come to you or visit a workshop.
            </p>
          </div>

          {/* Mode Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Onsite Card */}
            <div
              onClick={() => setSelectedMode("onsite")}
              className={`p-5 rounded-xl border cursor-pointer transition space-y-2 ${
                selectedMode === "onsite"
                  ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800/80 shadow-md"
                  : "border-wire-300 dark:border-wire-700 bg-white dark:bg-wire-850 hover:border-wire-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">🚐</span>
                <span className="text-[10px] font-mono uppercase text-wire-400">Mobile Service</span>
              </div>
              <h3 className="font-bold text-sm text-wire-900 dark:text-white">Onsite</h3>
              <p className="text-xs text-wire-600 dark:text-wire-300 leading-relaxed font-medium">
                &ldquo;Mechanic comes to my location&rdquo;
              </p>
              <div className="text-[11px] text-wire-500 pt-1 border-t border-wire-200 dark:border-wire-700">
                Mobile technician van visits home, office, or roadside with tools. Shows visit charge and ETA.
              </div>
            </div>

            {/* Offsite Card */}
            <div
              onClick={() => setSelectedMode("offsite")}
              className={`p-5 rounded-xl border cursor-pointer transition space-y-2 ${
                selectedMode === "offsite"
                  ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800/80 shadow-md"
                  : "border-wire-300 dark:border-wire-700 bg-white dark:bg-wire-850 hover:border-wire-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">🏢</span>
                <span className="text-[10px] font-mono uppercase text-wire-400">Workshop Visit</span>
              </div>
              <h3 className="font-bold text-sm text-wire-900 dark:text-white">Offsite</h3>
              <p className="text-xs text-wire-600 dark:text-wire-300 leading-relaxed font-medium">
                &ldquo;I will visit the workshop&rdquo;
              </p>
              <div className="text-[11px] text-wire-500 pt-1 border-t border-wire-200 dark:border-wire-700">
                Drive or drop off vehicle at certified garage. Shows workshop address, km away, and time slots.
              </div>
            </div>
          </div>

          {/* Continue Button: DISABLED UNTIL SELECTED */}
          <div className="pt-2">
            <button
              disabled={!selectedMode}
              onClick={() => setIsModeConfirmed(true)}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
                selectedMode
                  ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900 cursor-pointer shadow-md hover:opacity-95"
                  : "bg-wire-200 text-wire-400 dark:bg-wire-800 dark:text-wire-600 cursor-not-allowed"
              }`}
            >
              {selectedMode ? "Continue to Mechanics ➔" : "Select a Mode Above to Continue ➔"}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: MECHANIC RESULTS (WITH FILTERS & RATINGS) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Filter Sidebar (3 cols) */}
          <aside className="lg:col-span-3 border border-wire-300 dark:border-wire-700 rounded-xl p-4 space-y-4 text-xs bg-white dark:bg-wire-900">
            <div className="flex items-center justify-between border-b border-wire-200 dark:border-wire-800 pb-2">
              <span className="font-mono font-bold uppercase text-wire-500 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Mechanics</span>
              </span>
              <button
                onClick={() => {
                  setMinRating(4.0);
                  setMaxDistance(10);
                  setAvailableOnly(false);
                  setSearchQuery("");
                }}
                className="text-[11px] text-wire-500 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-1">
              <label className="font-bold text-wire-900 dark:text-white">Search Workshop</label>
              <input
                type="text"
                placeholder="Workshop or brand name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-wire-300 dark:border-wire-700 rounded px-2.5 py-1.5 bg-transparent"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <div className="font-bold text-wire-900 dark:text-white">Live Availability</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded text-wire-900"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Available Now</span>
                </span>
              </label>
            </div>

            {/* Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-wire-900 dark:text-white">
                <span>Max Distance</span>
                <span className="font-mono text-wire-500">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-wire-900 dark:accent-white"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5">
              <div className="font-bold text-wire-900 dark:text-white">Minimum Rating</div>
              <div className="grid grid-cols-3 gap-1 text-center font-mono">
                {[3.5, 4.0, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`py-1 rounded text-xs transition ${
                      minRating === r
                        ? "border-2 border-wire-900 dark:border-white font-bold bg-wire-100 dark:bg-wire-800 text-wire-900 dark:text-white"
                        : "border border-wire-300 dark:border-wire-700 text-wire-600 dark:text-wire-400"
                    }`}
                  >
                    {r}+ ★
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Description Box */}
            <div className="p-3 bg-wire-50 dark:bg-wire-800/60 rounded-lg text-[11px] text-wire-600 dark:text-wire-400 space-y-1">
              <div>
                <strong>Selected Mode:</strong> {selectedMode === "onsite" ? "🚐 Onsite Service" : "🏢 Offsite Visit"}
              </div>
              <button
                onClick={() => setIsModeConfirmed(false)}
                className="text-wire-900 dark:text-white underline font-medium"
              >
                Change mode ‹
              </button>
            </div>
          </aside>

          {/* Results List Column (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs text-wire-500">
              <span>
                Showing <strong>{filteredShops.length} verified workshops</strong> within {maxDistance} km ({minRating}+ ★)
              </span>

              {/* View Switcher */}
              <div className="flex border border-wire-300 dark:border-wire-700 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 font-bold ${
                    viewMode === "list"
                      ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900"
                      : "bg-white dark:bg-wire-800 text-wire-600 dark:text-wire-400"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1 font-bold ${
                    viewMode === "map"
                      ? "bg-wire-900 text-white dark:bg-white dark:text-wire-900"
                      : "bg-white dark:bg-wire-800 text-wire-600 dark:text-wire-400"
                  }`}
                >
                  Map Radar
                </button>
              </div>
            </div>

            {viewMode === "map" ? (
              /* Simulated Map Radar */
              <div className="wireframe-box wireframe-cross rounded-xl h-96 relative flex items-center justify-center p-4">
                <div className="absolute top-3 left-3 bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-700 px-3 py-1.5 rounded-lg text-xs font-mono shadow-sm">
                  [GPS Map: Kochi Radar • 10 km Radius]
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-blue-300/40">
                    📍
                  </div>
                  <span className="text-[11px] font-bold bg-white dark:bg-wire-900 border px-2 py-0.5 rounded shadow mt-1">
                    Your Location
                  </span>
                </div>
              </div>
            ) : (
              /* Mechanic Cards Grid */
              <div className="space-y-4">
                {filteredShops.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-wire-400 rounded-xl text-wire-500 text-sm">
                    No verified mechanics found matching this filter criteria. Try expanding distance or lowering minimum rating.
                  </div>
                ) : (
                  filteredShops.map((shop) => (
                    <div
                      key={shop.id}
                      className="border border-wire-300 dark:border-wire-700 rounded-xl p-5 bg-white dark:bg-wire-850 hover:shadow-md transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full wireframe-box wireframe-cross flex items-center justify-center font-mono text-sm shrink-0">
                            [ 👤 ]
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-wire-900 dark:text-white">
                                {shop.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                                  shop.isOpenNow
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "bg-wire-100 text-wire-500 border-wire-300"
                                }`}
                              >
                                <span>{shop.isOpenNow ? "●" : "○"}</span>
                                <span>{shop.isOpenNow ? "Available" : "Offline"}</span>
                              </span>
                            </div>

                            {/* Ratings & Distance */}
                            <div className="flex items-center gap-2 text-xs text-wire-500">
                              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{shop.rating}</span>
                              </span>
                              <span>({shop.reviewsCount} verified reviews)</span>
                              <span>•</span>
                              <span className="font-mono text-wire-700 dark:text-wire-300">
                                📍 {formatDistance(shop.distanceKm)} away
                              </span>
                            </div>
                            <p className="text-[11px] text-wire-500">{shop.address}</p>
                          </div>
                        </div>

                        {/* Price & ETA Pill */}
                        <div className="text-right sm:border-l sm:border-wire-200 dark:sm:border-wire-700 sm:pl-4">
                          {selectedMode === "onsite" ? (
                            <div>
                              <div className="text-[11px] text-wire-400">Onsite Visit Fee</div>
                              <div className="text-base font-bold font-mono text-wire-900 dark:text-white">₹150</div>
                              <div className="text-[10px] text-emerald-600 font-bold">~15-20 min arrival</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[11px] text-wire-400">Next Available Slot</div>
                              <div className="text-sm font-bold text-emerald-600">Today, 02:30 PM</div>
                              <div className="text-[10px] text-wire-400">{shop.activeBays}/{shop.totalBays} Bays Free</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Supported makes tags */}
                      <div className="pt-2 border-t border-wire-200 dark:border-wire-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-mono text-wire-400 uppercase">Supported:</span>
                          {shop.supportedMakes.slice(0, 4).map((make) => (
                            <span
                              key={make}
                              className="px-2 py-0.5 rounded bg-wire-100 dark:bg-wire-800 text-wire-700 dark:text-wire-300 text-[10px]"
                            >
                              {make}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/customer/book?shop=${shop.id}`}
                            className="px-4 py-2 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider hover:opacity-90"
                          >
                            {selectedMode === "onsite" ? "Book Onsite Service" : "Reserve Garage Bay"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
