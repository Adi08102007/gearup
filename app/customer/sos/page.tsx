"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { TowCondition } from "@/lib/types";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { ArrowLeft, ShieldAlert, MapPin, Truck, AlertTriangle, CheckCircle, Navigation } from "lucide-react";

export default function EmergencySosPage() {
  const router = useRouter();
  const { activeVehicle, shops, createTowDispatch } = useApp();

  const [pickupAddress, setPickupAddress] = useState("Highway NH 66 Near Kalamassery Bypass, Kochi");
  const [destinationShopId, setDestinationShopId] = useState(shops[0]?.id || "");
  const [condition, setCondition] = useState<TowCondition>("rolls_freely");
  const [distanceKm] = useState(8.5);
  const [isDispatching, setIsDispatching] = useState(false);

  const baseFare = 1500;
  const perKmRate = 65;
  const totalFare = Math.round(baseFare + distanceKm * perKmRate);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    setTimeout(() => {
      createTowDispatch({
        vehicleInfo: {
          make: activeVehicle.make,
          model: activeVehicle.model,
          regNumber: activeVehicle.regNumber,
          condition,
        },
        pickupAddress,
        destinationShopId,
        distanceKm,
      });

      setIsDispatching(false);
      router.push("/crane");
    }, 800);
  };

  const conditions: { id: TowCondition; label: string; desc: string }[] = [
    { id: "rolls_freely", label: "Rolls Freely", desc: "Engine failure, battery dead, or flat tyre. Wheels spin normally." },
    { id: "wheels_locked", label: "Wheels Locked", desc: "Braked up, electronic park lock stuck, or broken steering." },
    { id: "severe_damage", label: "Collision / Severe", desc: "Body damage, suspension crushed, fluid leakage on road." },
    { id: "off_road", label: "Off-Road / Ditch", desc: "Stuck in mud, canal, or overturned requiring winch boom crane." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/customer"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-red-400 tracking-wider">Emergency Response</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">24/7 Recovery Fleet</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            <span>Highway Breakdown & Tow Request</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleDispatch} className="space-y-6">
        {/* Vehicle being towed banner */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Target Vehicle</div>
              <div className="text-base font-bold text-white">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </div>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
            {activeVehicle.regNumber}
          </span>
        </div>

        {/* Breakdown Condition */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">1. Vehicle Drivability / Condition</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((item) => (
              <div
                key={item.id}
                onClick={() => setCondition(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  condition === item.id
                    ? "bg-red-500/10 border-red-500/60 shadow-sm ring-1 ring-red-500/30"
                    : "bg-[#0f1422] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-sm text-white">{item.label}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Destination */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>2. Breakdown Location (GPS Pin / Landmark)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
                className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl pl-3.5 pr-28 py-3 outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setPickupAddress("GPS: 10.0261° N, 76.3125° E (NH 66)")}
                className="absolute right-2 top-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1"
              >
                <Navigation className="w-3 h-3 text-red-400" />
                <span>Current GPS</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">3. Drop-off Repair Workshop</label>
            <select
              value={destinationShopId}
              onChange={(e) => setDestinationShopId(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3.5 py-3 outline-none focus:border-red-500"
            >
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} ({shop.address}) - {formatDistance(shop.distanceKm)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transparent Fare Card */}
        <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Guaranteed Government-Standard Tariff</span>
            <span className="text-emerald-400 font-medium">No surge pricing</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Base Mobilization Fee (Includes first 5 km & hydraulic tie-down):</span>
              <span className="font-mono">{formatCurrency(baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transit Rate ({distanceKm} km @ ₹{perKmRate}/km):</span>
              <span className="font-mono">{formatCurrency(Math.round(distanceKm * perKmRate))}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Estimated Total Tow Fare:</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">{formatCurrency(totalFare)}</span>
          </div>
        </div>

        {/* Dispatch Button */}
        <button
          type="submit"
          disabled={isDispatching}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-base transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
        >
          <Truck className="w-5 h-5" />
          <span>{isDispatching ? "Mobilizing Nearest Flatbed Crane..." : "Dispatch Heavy Recovery Crane Now"}</span>
        </button>
      </form>
    </div>
  );
}
