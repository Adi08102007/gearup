"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Gauge, Plus, Trash2, CheckCircle2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

function LogServiceContent() {
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
        <p className="text-xs text-wire-500">Booking record not found.</p>
        <Link href="/mechanic" className="px-4 py-2 bg-wire-900 text-white rounded-lg text-xs font-bold uppercase">
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
      <div className="flex items-center gap-4 pb-4 border-b border-wire-300 dark:border-wire-700">
        <Link
          href="/mechanic"
          className="p-1.5 rounded-lg border border-wire-300 dark:border-wire-700 text-wire-700 dark:text-wire-300 hover:bg-wire-100 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-wire-900 dark:text-white">Log Service Completion & Odometer</h1>
          <p className="text-xs text-wire-500">
            Booking #{booking.bookingNumber} • {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.regNumber})
          </p>
        </div>
      </div>

      <form onSubmit={handleComplete} className="p-6 rounded-xl bg-white dark:bg-wire-850 border border-wire-300 dark:border-wire-700 space-y-6 shadow-sm text-xs">
        {/* Mandatory Odometer Field */}
        <div className="space-y-2 p-4 rounded-xl bg-wire-50 dark:bg-wire-800 border border-wire-300 dark:border-wire-600">
          <label className="text-xs font-bold text-wire-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <Gauge className="w-4 h-4 text-wire-700" />
            <span>Mandatory Verified Odometer Reading (km)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              required
              min={booking.vehicle.currentKm}
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full bg-white dark:bg-wire-900 border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-sm rounded-lg px-3.5 py-2 outline-none font-mono focus:border-wire-900"
            />
            <span className="text-xs text-wire-500 whitespace-nowrap font-mono">Current: {booking.vehicle.currentKm.toLocaleString()} km</span>
          </div>
          <p className="text-[11px] text-wire-500">
            This reading will reset the vehicle owner&apos;s next service interval to +10,000 km in their digital logbook.
          </p>
        </div>

        {/* Parts Itemizer */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
            Replaced OEM Parts & Fluids
          </label>
          <div className="space-y-2">
            {parts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-wire-50 dark:bg-wire-800 border border-wire-200 dark:border-wire-700 text-xs"
              >
                <span className="text-wire-800 dark:text-wire-200">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(p.cost)}</span>
                  <button
                    type="button"
                    onClick={() => removePart(idx)}
                    className="text-wire-400 hover:text-red-600 p-1"
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
              className="flex-1 bg-white dark:bg-wire-800 border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="number"
              placeholder="Cost (₹)"
              value={newPartCost}
              onChange={(e) => setNewPartCost(e.target.value)}
              className="w-28 bg-white dark:bg-wire-800 border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none font-mono"
            />
            <button
              type="button"
              onClick={addPart}
              className="px-3 py-2 bg-wire-900 text-white rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1 uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Labor Charges */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
            Workshop Labor / Inspection Charges (₹)
          </label>
          <input
            type="number"
            required
            value={laborCharge}
            onChange={(e) => setLaborCharge(Number(e.target.value))}
            className="w-full bg-white dark:bg-wire-800 border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none font-mono"
          />
        </div>

        {/* Bill Total Card */}
        <div className="p-4 rounded-xl bg-wire-100 dark:bg-wire-800 border border-wire-300 dark:border-wire-700 flex items-center justify-between">
          <div>
            <div className="text-xs text-wire-500">Total Invoice (Parts + Labor)</div>
            <div className="text-xl font-bold text-wire-900 dark:text-white font-mono">
              {formatCurrency(grandTotal)}
            </div>
          </div>
          <span className="text-xs text-wire-600 dark:text-wire-400 font-mono">
            Customer OTP: <strong>{booking.completionOtp}</strong>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Finalize Service & Notify Customer for Pickup ➔</span>
        </button>
      </form>
    </div>
  );
}

export default function LogServicePage() {
  return (
    <AuthGuard allowedRoles={["mechanic"]}>
      <LogServiceContent />
    </AuthGuard>
  );
}
