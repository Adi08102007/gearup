"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { FuelType } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

function AddVehicleContent() {
  const router = useRouter();
  const { addVehicle } = useApp();

  // NONE selected by default
  const [selectedType, setSelectedType] = useState<"car" | "bike" | "comm" | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [currentKm, setCurrentKm] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("Petrol");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      setErrorMsg("Please select a vehicle type (Car, Two-Wheeler, or Commercial).");
      return;
    }
    if (!brand || !model || !regNumber || !currentKm) {
      setErrorMsg("Please fill out all required vehicle details.");
      return;
    }

    addVehicle({
      make: brand.trim(),
      model: model.trim(),
      year: new Date().getFullYear(),
      regNumber: regNumber.trim().toUpperCase(),
      fuelType,
      currentKm: Number(currentKm),
      insuranceExpiry: "Nov 2027",
      pollutionExpiry: "May 2027",
    });

    router.push("/customer");
  };

  return (
    <div className="max-w-lg mx-auto py-6 sm:py-10">
      <div className="border border-wire-300 dark:border-wire-700 rounded-xl p-6 sm:p-8 bg-white dark:bg-wire-850 space-y-6 shadow-sm text-xs">
        
        {/* Header */}
        <div className="border-b border-wire-200 dark:border-wire-700 pb-3 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono text-wire-500 uppercase">Post-Signup Onboarding</span>
            <h1 className="text-xl font-bold text-wire-900 dark:text-white mt-0.5">Add Your First Vehicle</h1>
            <p className="text-wire-500 text-xs mt-0.5">
              Register a vehicle to enable km-based maintenance alerts and fast breakdown dispatch.
            </p>
          </div>
          <Link
            href="/customer"
            className="text-xs text-wire-500 hover:text-wire-900 underline font-medium whitespace-nowrap ml-2"
          >
            Skip for now ›
          </Link>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-300 rounded text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Type Cards: NONE selected by default */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-wire-700 dark:text-wire-300">
              Select Vehicle Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={() => {
                  setSelectedType("car");
                  setErrorMsg("");
                }}
                className={`p-3 rounded-lg text-center cursor-pointer transition ${
                  selectedType === "car"
                    ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800 font-bold shadow-sm"
                    : "border border-wire-300 dark:border-wire-700 hover:border-wire-500"
                }`}
              >
                <div className="text-xl">🚗</div>
                <div className="text-xs font-medium mt-1">Car / 4W</div>
              </div>

              <div
                onClick={() => {
                  setSelectedType("bike");
                  setErrorMsg("");
                }}
                className={`p-3 rounded-lg text-center cursor-pointer transition ${
                  selectedType === "bike"
                    ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800 font-bold shadow-sm"
                    : "border border-wire-300 dark:border-wire-700 hover:border-wire-500"
                }`}
              >
                <div className="text-xl">🛵</div>
                <div className="text-xs font-medium mt-1">Two-Wheeler</div>
              </div>

              <div
                onClick={() => {
                  setSelectedType("comm");
                  setErrorMsg("");
                }}
                className={`p-3 rounded-lg text-center cursor-pointer transition ${
                  selectedType === "comm"
                    ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800 font-bold shadow-sm"
                    : "border border-wire-300 dark:border-wire-700 hover:border-wire-500"
                }`}
              >
                <div className="text-xl">🚐</div>
                <div className="text-xs font-medium mt-1">Commercial</div>
              </div>
            </div>
          </div>

          {/* Form Fields: All EMPTY with placeholders only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Brand / Make *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Brand / Make"
                className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Model *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Model name"
                className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Registration No *</label>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. Registration number"
                className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent uppercase font-mono font-bold text-wire-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Current Odometer km *</label>
              <input
                type="number"
                required
                min={0}
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value)}
                placeholder="e.g. Current odometer km"
                className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent font-mono text-wire-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-white dark:bg-wire-800 text-wire-900 dark:text-white"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          {/* Helper note explaining why km matters */}
          <div className="p-3 bg-wire-50 dark:bg-wire-800 rounded text-[11px] text-wire-600 dark:text-wire-400 leading-relaxed border border-wire-200 dark:border-wire-700">
            💡 <strong>Why km matters:</strong> GearUp uses your current odometer reading to calculate and schedule maintenance alerts (e.g., oil changes every 10,000 km, brake checks, fluid flushes).
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm"
          >
            Save Vehicle & Enter Dashboard ➔
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddVehiclePage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <AddVehicleContent />
    </AuthGuard>
  );
}
