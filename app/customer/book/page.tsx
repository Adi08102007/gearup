"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { formatCurrency, formatDistance } from "@/lib/utils";
import { ArrowLeft, Star, MapPin, Check, Wrench, Calendar, Clock, AlertCircle, Car } from "lucide-react";
import { ServiceItem } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

function BookServiceContent() {
  const router = useRouter();
  const { shops, activeVehicle, createBooking } = useApp();

  const [selectedShopId, setSelectedShopId] = useState(shops[0]?.id || "");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [scheduledDate, setScheduledDate] = useState("Tomorrow, 10:00 AM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-wire-300 dark:border-wire-700 pb-4">
          <Link
            href="/customer"
            className="p-1 border border-wire-300 dark:border-wire-700 rounded text-xs hover:bg-wire-100"
          >
            ‹ Dashboard
          </Link>
          <h1 className="text-xl font-bold text-wire-900 dark:text-white">Book Workshop Service</h1>
        </div>

        <div className="p-8 sm:p-12 border-2 border-dashed border-wire-300 dark:border-wire-700 rounded-2xl text-center space-y-4 bg-white dark:bg-wire-900 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-wire-100 dark:bg-wire-800 flex items-center justify-center text-wire-500">
            <Car className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-wire-900 dark:text-white">No vehicle added yet.</h2>
            <p className="text-xs text-wire-500">
              Please add your vehicle first to select compatible service packages and book verified workshops.
            </p>
          </div>
          <Link
            href="/customer/add-vehicle"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-sm"
          >
            <span>Add your vehicle</span>
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center gap-4 pb-4 border-b border-wire-300 dark:border-wire-700">
        <Link
          href="/customer"
          className="p-1.5 rounded-lg border border-wire-300 dark:border-wire-700 text-wire-700 dark:text-wire-300 hover:bg-wire-100 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-wire-900 dark:text-white">Book Workshop Service</h1>
          <p className="text-xs text-wire-500">
            For {activeVehicle.make} {activeVehicle.model} ({activeVehicle.regNumber}) • <span className="font-mono">{activeVehicle.currentKm.toLocaleString()} km</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Workshop */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
            1. Select Garage / Workshop
          </label>
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
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800 shadow-sm"
                      : "border-wire-300 dark:border-wire-700 bg-white dark:bg-wire-850 hover:border-wire-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-wire-900 dark:text-white text-xs">{shop.name}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold font-mono">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-wire-500 mt-2">
                    <MapPin className="w-3 h-3" />
                    <span>{formatDistance(shop.distanceKm)} away</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {shop.isEmergencyCapable && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 font-bold">
                        Express Bay
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
            <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
              2. Select Service Packages
            </label>
            <span className="text-xs text-wire-500">{selectedServices.length} selected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeShop?.services.map((item) => {
              const isSelected = selectedServices.some((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleService(item)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? "border-2 border-wire-900 dark:border-white bg-wire-50 dark:bg-wire-800 shadow-sm"
                      : "border-wire-300 dark:border-wire-700 bg-white dark:bg-wire-850 hover:border-wire-400"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-wire-100 dark:bg-wire-700 text-wire-800 dark:text-wire-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-wire-500">~{item.durationMinutes} mins</span>
                    </div>
                    <h4 className="font-bold text-xs text-wire-900 dark:text-white">{item.name}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                        isSelected
                          ? "bg-wire-900 border-wire-900 dark:bg-white dark:border-white text-white dark:text-wire-900"
                          : "border-wire-300 dark:border-wire-600 bg-transparent text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Slot & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
              3. Preferred Appointment Slot
            </label>
            <select
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2.5 bg-white dark:bg-wire-850 focus:outline-none"
            >
              <option value="Today, 04:30 PM">Today, 04:30 PM (Express Bay)</option>
              <option value="Tomorrow, 09:30 AM">Tomorrow, 09:30 AM</option>
              <option value="Tomorrow, 02:00 PM">Tomorrow, 02:00 PM</option>
              <option value="Saturday, 10:00 AM">Saturday, 10:00 AM</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-wire-700 dark:text-wire-300">
              Specific Symptoms or Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Mild vibration at 80 km/h, check brake squeal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-wire-300 dark:border-wire-600 text-wire-900 dark:text-white text-xs rounded-lg px-3 py-2.5 bg-white dark:bg-wire-850 focus:outline-none placeholder:text-wire-400"
            />
          </div>
        </div>

        {/* Price Summary & Submit Bar */}
        <div className="p-5 rounded-xl bg-wire-50 dark:bg-wire-800 border border-wire-300 dark:border-wire-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-wire-500">Estimated Total (Labor & Inspection)</div>
            <div className="text-xl font-bold text-wire-900 dark:text-white font-mono">
              {formatCurrency(totalEstimate)}
            </div>
            <p className="text-[11px] text-wire-400">Parts replaced will be logged and billed upon customer approval</p>
          </div>

          <button
            type="submit"
            disabled={selectedServices.length === 0 || isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-wire-900 text-white dark:bg-white dark:text-wire-900 disabled:opacity-50 font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm"
          >
            {isSubmitting ? "Confirming Booking..." : "Confirm & Send to Garage ➔"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BookServicePage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <BookServiceContent />
    </AuthGuard>
  );
}
