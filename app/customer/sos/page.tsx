"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { TowCondition } from "@/lib/types";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { ArrowLeft, ShieldAlert, MapPin, Truck, AlertTriangle, CheckCircle, Navigation, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

function EmergencySosContent() {
  const router = useRouter();
  const { activeVehicle, shops, createTowDispatch } = useApp();

  const [pickupAddress, setPickupAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [customVehicle, setCustomVehicle] = useState({
    make: activeVehicle?.make || "",
    model: activeVehicle?.model || "",
    regNumber: activeVehicle?.regNumber || "",
  });
  const [destinationShopId, setDestinationShopId] = useState(shops[0]?.id || "");
  const [condition, setCondition] = useState<TowCondition>("rolls_freely");
  const [distanceKm] = useState(6.5);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const baseFare = 1500;
  const perKmRate = 65;
  const totalFare = Math.round(baseFare + distanceKm * perKmRate);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupAddress(`GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setIsLocating(false);
        alert("Could not access GPS. Please type the breakdown location or highway landmark.");
      },
      { timeout: 10000 }
    );
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress) {
      alert("Please specify the breakdown location or use GPS.");
      return;
    }

    const vMake = activeVehicle ? activeVehicle.make : customVehicle.make || "Vehicle";
    const vModel = activeVehicle ? activeVehicle.model : customVehicle.model || "Model";
    const vReg = activeVehicle ? activeVehicle.regNumber : customVehicle.regNumber || "EMERG-001";

    setIsDispatching(true);

    setTimeout(() => {
      createTowDispatch({
        vehicleInfo: {
          make: vMake,
          model: vModel,
          regNumber: vReg,
          condition,
        },
        pickupAddress,
        destinationShopId,
        distanceKm,
      });

      setIsDispatching(false);
      setIsDispatched(true);
    }, 800);
  };

  const conditions: { id: TowCondition; label: string; desc: string }[] = [
    { id: "rolls_freely", label: "Rolls Freely", desc: "Engine failure, battery dead, or flat tyre. Wheels spin normally." },
    { id: "wheels_locked", label: "Wheels Locked", desc: "Braked up, electronic park lock stuck, or broken steering." },
    { id: "severe_damage", label: "Collision / Severe", desc: "Body damage, suspension crushed, fluid leakage on road." },
    { id: "off_road", label: "Off-Road / Ditch", desc: "Stuck in mud, canal, or overturned requiring winch boom crane." },
  ];

  if (isDispatched) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5 bg-white dark:bg-wire-850 p-8 border-2 border-red-600 rounded-2xl shadow-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          🚨
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2.5 py-1 rounded">
            Emergency Dispatch Active
          </span>
          <h2 className="text-2xl font-bold text-wire-900 dark:text-white">Crane Mobilized!</h2>
          <p className="text-xs text-wire-600 dark:text-wire-400">
            Flatbed Recovery Unit has been assigned to your coordinates. Estimated technician arrival is within 15-20 minutes.
          </p>
        </div>

        <div className="p-4 border border-wire-200 dark:border-wire-700 rounded-xl bg-wire-50 dark:bg-wire-800/40 text-left text-xs space-y-1.5 font-mono">
          <div>Pickup: <strong>{pickupAddress}</strong></div>
          <div>Condition: <strong className="uppercase">{condition.replace("_", " ")}</strong></div>
          <div>Guaranteed Fare: <strong className="text-emerald-600">₹{totalFare}</strong></div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/customer"
            className="px-5 py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold rounded-lg text-xs uppercase tracking-wider"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-wire-300 dark:border-wire-700">
        <Link
          href="/customer"
          className="p-2 rounded-lg border border-wire-300 dark:border-wire-700 text-wire-700 dark:text-wire-300 hover:bg-wire-100 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-red-600 tracking-wider">Emergency Response</span>
            <span className="text-wire-400">•</span>
            <span className="text-xs text-wire-500">24/7 Roadside Recovery</span>
          </div>
          <h1 className="text-2xl font-bold text-wire-900 dark:text-white flex items-center gap-2 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
            <span>Highway Breakdown & Tow Request</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleDispatch} className="space-y-6">
        {/* Vehicle being towed banner */}
        <div className="p-4 rounded-xl bg-wire-50 dark:bg-wire-800 border border-wire-300 dark:border-wire-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-wire-500">Target Vehicle for Towing</div>
              <div className="text-sm font-bold text-wire-900 dark:text-white">
                {activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : "Emergency Breakdown Vehicle"}
              </div>
            </div>
          </div>
          {activeVehicle ? (
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-white dark:bg-wire-700 border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white">
              {activeVehicle.regNumber}
            </span>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Make & Model"
                value={customVehicle.model}
                onChange={(e) => setCustomVehicle({ ...customVehicle, model: e.target.value })}
                className="px-2 py-1 border border-wire-300 rounded text-xs"
              />
              <input
                type="text"
                placeholder="Plate No."
                value={customVehicle.regNumber}
                onChange={(e) => setCustomVehicle({ ...customVehicle, regNumber: e.target.value })}
                className="px-2 py-1 border border-wire-300 rounded text-xs font-mono"
              />
            </div>
          )}
        </div>

        {/* Breakdown Condition */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
            1. Vehicle Drivability / Condition
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((item) => (
              <div
                key={item.id}
                onClick={() => setCondition(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition text-xs ${
                  condition === item.id
                    ? "border-2 border-red-600 bg-red-50/60 dark:bg-red-950/30 shadow-sm"
                    : "border-wire-300 dark:border-wire-700 bg-white dark:bg-wire-850 hover:border-wire-500"
                }`}
              >
                <div className="font-bold text-wire-900 dark:text-white">{item.label}</div>
                <div className="text-wire-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Destination */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>2. Breakdown Location (GPS Pin / Landmark)</span>
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
              >
                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                <span>Use Current GPS</span>
              </button>
            </div>
            <div className="flex items-center border border-wire-300 dark:border-wire-600 rounded-lg px-3 py-2.5 bg-white dark:bg-wire-850">
              <span className="mr-2 text-wire-400">📍</span>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter highway landmark, mile marker, or click 'Use Current GPS'"
                required
                className="w-full bg-transparent focus:outline-none text-xs text-wire-900 dark:text-white placeholder:text-wire-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
              3. Drop-off Repair Workshop
            </label>
            <select
              value={destinationShopId}
              onChange={(e) => setDestinationShopId(e.target.value)}
              className="w-full border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2.5 bg-white dark:bg-wire-850 focus:outline-none"
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
        <div className="p-5 rounded-xl bg-wire-50 dark:bg-wire-800/50 border border-wire-300 dark:border-wire-700 space-y-3">
          <div className="flex items-center justify-between text-xs text-wire-500 pb-2 border-b border-wire-200 dark:border-wire-700">
            <span>Guaranteed Standard Tow Tariff</span>
            <span className="text-emerald-600 font-bold">No surge pricing</span>
          </div>

          <div className="space-y-1.5 text-xs text-wire-600 dark:text-wire-300">
            <div className="flex justify-between">
              <span>Base Mobilization Fee (Includes hydraulic tie-down):</span>
              <span className="font-mono">{formatCurrency(baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Transit Rate ({distanceKm} km @ ₹{perKmRate}/km):</span>
              <span className="font-mono">{formatCurrency(Math.round(distanceKm * perKmRate))}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-wire-200 dark:border-wire-700 flex items-center justify-between">
            <span className="text-sm font-bold text-wire-900 dark:text-white">Estimated Total Tow Fare:</span>
            <span className="text-xl font-bold text-red-600 font-mono">{formatCurrency(totalFare)}</span>
          </div>
        </div>

        {/* Dispatch Button */}
        <button
          type="submit"
          disabled={isDispatching}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
        >
          <Truck className="w-5 h-5" />
          <span>{isDispatching ? "Mobilizing Nearest Flatbed Crane..." : "Dispatch Heavy Recovery Crane Now ➔"}</span>
        </button>
      </form>
    </div>
  );
}

export default function EmergencySosPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <EmergencySosContent />
    </AuthGuard>
  );
}
