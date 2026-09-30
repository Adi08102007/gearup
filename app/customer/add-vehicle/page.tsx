"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { ArrowLeft, Car, Plus, ShieldCheck } from "lucide-react";
import { FuelType } from "@/lib/types";

export default function AddVehiclePage() {
  const router = useRouter();
  const { addVehicle } = useApp();

  const [make, setMake] = useState("Honda");
  const [model, setModel] = useState("City 1.5 i-VTEC");
  const [year, setYear] = useState(2023);
  const [regNumber, setRegNumber] = useState("KL 07 DX 1122");
  const [fuelType, setFuelType] = useState<FuelType>("Petrol");
  const [currentKm, setCurrentKm] = useState(18500);
  const [insuranceExpiry, setInsuranceExpiry] = useState("2027-08-30");
  const [pollutionExpiry, setPollutionExpiry] = useState("2027-02-15");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      make,
      model,
      year: Number(year),
      regNumber: regNumber.toUpperCase(),
      fuelType,
      currentKm: Number(currentKm),
      insuranceExpiry,
      pollutionExpiry,
    });
    router.push("/customer");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/customer"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Vehicle</h1>
          <p className="text-xs text-slate-400">Enroll your car into the automated health & maintenance network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Vehicle Brand / Make</label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Model & Variant</label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Manufacturing Year</label>
            <input
              type="number"
              required
              min={1995}
              max={2026}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Registration Number</label>
            <input
              type="text"
              required
              placeholder="KL 07 XX 0000"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Current Odometer Reading (km)</label>
          <input
            type="number"
            required
            min={0}
            value={currentKm}
            onChange={(e) => setCurrentKm(Number(e.target.value))}
            className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 font-mono"
          />
          <span className="text-[11px] text-slate-500">Used as the baseline to schedule upcoming periodic maintenance</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Insurance Expiry</label>
            <input
              type="date"
              value={insuranceExpiry}
              onChange={(e) => setInsuranceExpiry(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Pollution Certificate Expiry</label>
            <input
              type="date"
              value={pollutionExpiry}
              onChange={(e) => setPollutionExpiry(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Vehicle in Garage Network</span>
          </button>
        </div>
      </form>
    </div>
  );
}
