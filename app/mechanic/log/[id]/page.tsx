"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Gauge, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function LogServicePage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { bookings, logServiceOdometer } = useApp();

  const booking = bookings.find((b) => b.id === bookingId);

  const [odometer, setOdometer] = useState(booking?.vehicle.currentKm || 42350);
  const [laborCharge, setLaborCharge] = useState(booking?.laborCharge || 1800);
  const [parts, setParts] = useState<{ name: string; cost: number }[]>([
    { name: "Synthetic 5W-40 Engine Oil (4.2L)", cost: 3200 },
    { name: "OEM Oil Filter Cartridge", cost: 580 },
  ]);
  const [newPartName, setNewPartName] = useState("");
  const [newPartCost, setNewPartCost] = useState("");

  if (!booking) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-400">Booking record not found.</p>
        <Link href="/mechanic" className="px-4 py-2 bg-slate-800 rounded-lg text-white text-sm">
          Return to Workshop Dashboard
        </Link>
      </div>
    );
  }

  const addPart = () => {
    if (!newPartName || !newPartCost) return;
    setParts([...parts, { name: newPartName, cost: Number(newPartCost) }]);
    setNewPartName("");
    setNewPartCost("");
  };

  const removePart = (idx: number) => {
    setParts(parts.filter((_, i) => i !== idx));
  };

  const totalPartsCost = parts.reduce((sum, p) => sum + p.cost, 0);
  const grandTotal = totalPartsCost + Number(laborCharge);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    logServiceOdometer(bookingId, Number(odometer), parts, Number(laborCharge));
    router.push("/mechanic");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/mechanic"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Log Service Completion & Odometer</h1>
          <p className="text-xs text-slate-400">
            Booking #{booking.bookingNumber} • {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.regNumber})
          </p>
        </div>
      </div>

      <form onSubmit={handleComplete} className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-6">
        {/* Mandatory Odometer Field */}
        <div className="space-y-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span>Mandatory Verified Odometer Reading (km)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              required
              min={booking.vehicle.currentKm}
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full bg-[#131929] border border-blue-500/50 text-white text-base rounded-xl px-4 py-2.5 outline-none font-mono focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">Current: {booking.vehicle.currentKm.toLocaleString()} km</span>
          </div>
          <p className="text-[11px] text-slate-400">
            This reading will reset the vehicle owner&apos;s next service interval to +10,000 km in their digital logbook.
          </p>
        </div>

        {/* Parts Itemizer */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Replaced OEM Parts & Fluids</label>
          <div className="space-y-2">
            {parts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#131929] border border-slate-800 text-sm"
              >
                <span className="text-slate-200">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400">{formatCurrency(p.cost)}</span>
                  <button
                    type="button"
                    onClick={() => removePart(idx)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Part Sub-form */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="e.g. Front Ceramic Brake Pads (Pair)"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="flex-1 bg-[#131929] border border-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
            />
            <input
              type="number"
              placeholder="Cost (₹)"
              value={newPartCost}
              onChange={(e) => setNewPartCost(e.target.value)}
              className="w-28 bg-[#131929] border border-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none font-mono"
            />
            <button
              type="button"
              onClick={addPart}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Labor Charges */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Workshop Labor / Inspection Charges (₹)</label>
          <input
            type="number"
            required
            value={laborCharge}
            onChange={(e) => setLaborCharge(Number(e.target.value))}
            className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none font-mono"
          />
        </div>

        {/* Bill Total Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Invoice (Parts + Labor)</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {formatCurrency(grandTotal)}
            </div>
          </div>
          <span className="text-xs text-slate-400">Generates Customer OTP: <strong>{booking.completionOtp}</strong></span>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Finalize Service & Notify Customer for Pickup</span>
        </button>
      </form>
    </div>
  );
}
