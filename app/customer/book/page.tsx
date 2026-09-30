"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { ArrowLeft, Star, MapPin, Check, Wrench, Calendar, Clock, AlertCircle } from "lucide-react";
import { ServiceItem } from "@/lib/types";

export default function BookServicePage() {
  const router = useRouter();
  const { shops, activeVehicle, createBooking } = useApp();

  const [selectedShopId, setSelectedShopId] = useState(shops[0]?.id || "");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [scheduledDate, setScheduledDate] = useState("Tomorrow, 10:00 AM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeShop = shops.find((s) => s.id === selectedShopId) || shops[0];

  const toggleService = (item: ServiceItem) => {
    if (selectedServices.some((s) => s.id === item.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
    } else {
      setSelectedServices([...selectedServices, item]);
    }
  };

  const totalEstimate = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createBooking(selectedShopId, selectedServices, scheduledDate, notes);
      setIsSubmitting(false);
      router.push("/customer");
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/customer"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Book Workshop Service</h1>
          <p className="text-xs text-slate-400">
            For {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber}) • {activeVehicle.currentKm.toLocaleString()} km
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Workshop */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">1. Select Garage / Workshop</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shops.map((shop) => {
              const isSelected = shop.id === selectedShopId;
              return (
                <div
                  key={shop.id}
                  onClick={() => {
                    setSelectedShopId(shop.id);
                    setSelectedServices([]);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600/10 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                      : "bg-[#0f1422] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-white text-sm">{shop.name}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDistance(shop.distanceKm)} away</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {shop.isEmergencyCapable && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        Express Bays Open
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Services */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200">2. Select Service Packages</label>
            <span className="text-xs text-slate-400">{selectedServices.length} selected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeShop?.services.map((item) => {
              const isSelected = selectedServices.some((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleService(item)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/60 shadow-sm"
                      : "bg-[#0f1422] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">~{item.durationMinutes} mins</span>
                    </div>
                    <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-700 bg-slate-800 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Slot & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">3. Preferred Appointment Slot</label>
            <select
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="Today, 04:30 PM">Today, 04:30 PM (Express Bay)</option>
              <option value="Tomorrow, 09:30 AM">Tomorrow, 09:30 AM</option>
              <option value="Tomorrow, 02:00 PM">Tomorrow, 02:00 PM</option>
              <option value="Saturday, 10:00 AM">Saturday, 10:00 AM</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Specific Symptoms or Requests (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Mild vibration at 80 km/h, check brake squeal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Price Summary & Submit Bar */}
        <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Estimated Total (Labor & Inspection)</div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatCurrency(totalEstimate)}
            </div>
            <p className="text-[11px] text-slate-500">Parts replaced will be logged and billed upon garage approval</p>
          </div>

          <button
            type="submit"
            disabled={selectedServices.length === 0 || isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            {isSubmitting ? "Confirming Booking..." : "Confirm & Send to Garage"}
          </button>
        </div>
      </form>
    </div>
  );
}
