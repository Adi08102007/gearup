"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { UserRole } from "@/lib/types";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get("role") as UserRole) || "customer";

  const { login } = useApp();

  const [activeRole, setActiveRole] = useState<UserRole>(roleParam);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(false);

  // Mechanic Stepper State (5 Steps)
  const [mechStep, setMechStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");

  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    login("customer", email || phone, password);
    // Post-signup onboarding: go to add first vehicle
    router.push("/customer/add-vehicle");
  };

  const handleSubmitMechanic = (e: React.FormEvent) => {
    e.preventDefault();
    login("mechanic", email || phone, password);
    router.push("/mechanic");
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      {activeRole === "customer" ? (
        /* CUSTOMER SIGN UP (Matches index.html Screen 3) */
        <div className="w-full border border-wire-300 dark:border-wire-700 rounded-xl p-6 sm:p-8 bg-white dark:bg-wire-850 shadow-sm space-y-5 text-xs">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-wire-900 dark:text-white">Customer Sign Up</h1>
            <p className="text-wire-500">
              Create an account to track your vehicle maintenance and book emergency roadside assistance.
            </p>
          </div>

          <form onSubmit={handleSubmitCustomer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 90000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
            </div>

            {/* Location Permission Explanation Card */}
            <div className="p-3.5 border border-wire-300 dark:border-wire-700 rounded-lg bg-wire-50 dark:bg-wire-800 space-y-2">
              <div className="font-bold text-wire-900 dark:text-white flex items-center gap-1.5">
                <span>📍</span>
                <span>Location Permission Notice</span>
              </div>
              <p className="text-wire-600 dark:text-wire-400 text-[11px] leading-relaxed">
                GearUp requires location access to find and dispatch nearby mechanics to your exact breakdown coordinates in emergencies without manual typing.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => setLocationAllowed(true));
                    } else {
                      setLocationAllowed(true);
                    }
                  }}
                  className={`px-3 py-1 rounded text-[11px] font-medium ${
                    locationAllowed
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-wire-900 text-white dark:bg-white dark:text-wire-900"
                  }`}
                >
                  {locationAllowed ? "✓ Location Allowed" : "Allow Location"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm"
            >
              Sign up & Add First Vehicle ➔
            </button>

            <div className="text-center pt-1 text-xs">
              <span className="text-wire-500">Already have an account? </span>
              <Link href="/login" className="font-bold underline text-wire-900 dark:text-white">
                Login
              </Link>
            </div>
          </form>
        </div>
      ) : (
        /* MECHANIC PARTNER SIGNUP (5-Step Stepper) */
        <div className="w-full border border-wire-300 dark:border-wire-700 rounded-xl p-6 sm:p-8 bg-white dark:bg-wire-900 shadow-sm space-y-5 text-xs">
          <div className="border-b border-wire-200 dark:border-wire-800 pb-3">
            <h1 className="text-lg font-bold text-wire-900 dark:text-white">Register Workshop & Partner Account</h1>
            <p className="text-wire-500">Step {mechStep} of 5</p>
          </div>

          <form onSubmit={handleSubmitMechanic} className="space-y-4">
            {mechStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block font-medium mb-1">Partner Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Owner / Manager name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Mobile Phone (for dispatch)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 90000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded p-2 bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMechStep(2)}
                  className="w-full py-2 bg-wire-900 text-white rounded font-bold"
                >
                  Next: Shop Details ➔
                </button>
              </div>
            )}

            {mechStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block font-medium mb-1">Shop / Garage Registered Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Workshop #1"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full border rounded p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Street Address</label>
                  <textarea
                    required
                    placeholder="Shop location address"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full border rounded p-2 bg-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMechStep(1)} className="px-4 py-2 border rounded">
                    ‹ Back
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-700 text-white rounded font-bold">
                    Submit Workshop Application ✓
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-wire-500">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
