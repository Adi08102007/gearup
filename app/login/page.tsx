"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { UserRole } from "@/lib/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = (searchParams.get("role") as UserRole) || "customer";
  const redirectParam = searchParams.get("redirect") || (roleParam === "mechanic" ? "/mechanic" : "/customer");
  const messageParam = searchParams.get("message") || "";

  const { login } = useApp();

  const [activeRole, setActiveRole] = useState<UserRole>(roleParam);
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isMechanic = activeRole === "mechanic";

  const handleRoleToggle = (newRole: UserRole) => {
    setActiveRole(newRole);
    setOtpSent(false);
    setErrorMsg("");
  };

  const handleSendOtp = () => {
    if (!identifier) {
      setErrorMsg("Please enter your registered email or phone number.");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setOtpCode("4821"); // Simulated OTP
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      login(activeRole, identifier, authMode === "otp" ? otpCode : password);
      setIsLoading(false);

      const rawRedirect = searchParams.get("redirect");
      let destination = activeRole === "mechanic" ? "/mechanic" : activeRole === "crane" ? "/crane" : "/customer";
      if (rawRedirect) {
        if (activeRole === "mechanic" && !rawRedirect.startsWith("/customer")) {
          destination = rawRedirect;
        } else if (activeRole === "customer" && !rawRedirect.startsWith("/mechanic") && !rawRedirect.startsWith("/crane")) {
          destination = rawRedirect;
        } else if (activeRole === "crane" && !rawRedirect.startsWith("/customer")) {
          destination = rawRedirect;
        }
      }

      router.push(destination);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12">
      {/* Informational Message Banner (e.g. "Please log in to continue") */}
      {messageParam && (
        <div className="mb-6 p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs text-center font-medium">
          🔒 {messageParam}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {isMechanic ? (
        /* =================================================================== */
        /* MECHANIC PRO PORTAL LOGIN (Matching mechanic_index.html Screen 1)   */
        /* =================================================================== */
        <div className="w-full grid md:grid-cols-12 border border-wire-300 dark:border-wire-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-wire-900">
          {/* Left: Partner Perks */}
          <div className="md:col-span-5 bg-wire-50 dark:bg-wire-850 p-6 md:p-8 border-b md:border-b-0 md:border-r border-wire-300 dark:border-wire-700 flex flex-col justify-between text-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase mb-4">
                <span>🛠️ Mechanic Partner Portal</span>
              </div>
              <h2 className="text-xl font-bold text-wire-900 dark:text-white mb-2">
                Grow your garage business with GearUp
              </h2>
              <p className="text-xs text-wire-600 dark:text-wire-400 mb-6 leading-relaxed">
                Direct customer breakdown alerts, transparent labor payouts, digital service history logging, and instant roadside dispatch.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span><strong>Instant Onsite & Offsite Jobs:</strong> Accept requests nearby within 2 minutes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span><strong>Transparent Pricing:</strong> Publish your own labor rates and parts catalog.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
                  <span><strong>Verified Badge:</strong> Build customer trust with genuine review badges.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-wire-200 dark:border-wire-800 mt-6 text-wire-500">
              Need help? Partner Helpline: <strong className="font-mono text-wire-800 dark:text-wire-200">1800-GEAR-PRO</strong>
            </div>
          </div>

          {/* Right: Partner Login Form */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center text-xs">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-wire-900 dark:text-white">Mechanic Login</h3>
              <p className="text-wire-500">Access your workshop dashboard, jobs, and earnings</p>
            </div>

            {/* Password vs OTP Switcher */}
            <div className="flex border border-wire-300 dark:border-wire-700 rounded-lg p-1 mb-4 font-medium bg-wire-50 dark:bg-wire-800">
              <button
                type="button"
                onClick={() => setAuthMode("password")}
                className={`flex-1 py-1.5 text-center rounded transition ${
                  authMode === "password"
                    ? "bg-white dark:bg-wire-700 shadow-sm font-bold text-wire-900 dark:text-white"
                    : "text-wire-600 dark:text-wire-400"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("otp")}
                className={`flex-1 py-1.5 text-center rounded transition ${
                  authMode === "otp"
                    ? "bg-white dark:bg-wire-700 shadow-sm font-bold text-wire-900 dark:text-white"
                    : "text-wire-600 dark:text-wire-400"
                }`}
              >
                OTP Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-wire-700 dark:text-wire-300 mb-1">
                  Registered Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. mechanic@workshop.com or +91 9876543210"
                  className="w-full px-3 py-2 border border-wire-300 dark:border-wire-700 rounded bg-white dark:bg-wire-800 text-wire-900 dark:text-white"
                />
              </div>

              {authMode === "password" ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-wire-700 dark:text-wire-300">Password</label>
                    <button type="button" className="text-wire-600 underline">Forgot password?</button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-wire-300 dark:border-wire-700 rounded bg-white dark:bg-wire-800"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium">Enter 6-digit OTP</label>
                    <button type="button" onClick={handleSendOtp} className="text-wire-600 underline">
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="• • • •"
                    className="w-full px-3 py-2 border border-wire-300 rounded text-center font-mono tracking-widest text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 font-bold rounded-lg hover:opacity-90 transition text-sm shadow-sm"
              >
                {isLoading ? "Signing in..." : "Sign In to Workshop Dashboard ➔"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-wire-200 dark:border-wire-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <span className="text-wire-500">
                New mechanic or garage?{" "}
                <Link href="/signup?role=mechanic" className="font-bold underline text-wire-900 dark:text-white">
                  Register Shop
                </Link>
              </span>
              <button
                type="button"
                onClick={() => handleRoleToggle("customer")}
                className="text-wire-600 underline hover:text-wire-900"
              >
                Not a mechanic? Customer login ›
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* CUSTOMER LOGIN (Matching index.html Screen 2)                       */
        /* =================================================================== */
        <div className="w-full max-w-md mx-auto border border-wire-300 dark:border-wire-700 rounded-xl p-6 sm:p-8 bg-white dark:bg-wire-850 shadow-sm space-y-5 text-xs">
          <div className="text-center space-y-1">
            <div className="text-2xl font-mono font-black text-wire-900 dark:text-white">⚙️ GEARUP</div>
            <h2 className="text-xl font-bold text-wire-900 dark:text-white">Customer Login</h2>
            <p className="text-wire-500">
              Access your registered vehicles, maintenance alerts, and active bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-wire-700 dark:text-wire-300">
                Email or Mobile Phone
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. customer@example.com or phone number"
                className="w-full border border-wire-300 dark:border-wire-600 rounded p-2.5 bg-transparent text-wire-900 dark:text-white"
              />
            </div>

            {authMode === "password" ? (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-wire-700 dark:text-wire-300">Password</label>
                  <Link href="/forgot" className="text-wire-500 hover:underline">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2.5 bg-transparent text-wire-900 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-wire-700 dark:text-wire-300">Enter OTP</label>
                  <button type="button" onClick={handleSendOtp} className="text-wire-500 hover:underline">
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4-digit code"
                  className="w-full border border-wire-300 dark:border-wire-600 rounded p-2.5 text-center font-mono tracking-widest text-sm"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-wire-600 dark:text-wire-400">
                <input type="checkbox" defaultChecked className="rounded border-wire-300" />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-wire-900 text-white dark:bg-white dark:text-wire-900 rounded font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-sm"
            >
              {isLoading ? "Signing in..." : "Sign In ➔"}
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-wire-300 dark:border-wire-700 w-full"></div>
              <span className="bg-white dark:bg-wire-850 px-2 text-[11px] font-mono text-wire-400 uppercase">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "password" ? "otp" : "password");
                setOtpSent(false);
              }}
              className="w-full py-2.5 border border-wire-400 dark:border-wire-600 rounded font-medium text-xs hover:bg-wire-50 dark:hover:bg-wire-800"
            >
              {authMode === "password" ? "📲 Sign In With OTP" : "🔑 Sign In With Password"}
            </button>

            <div className="text-center pt-2 border-t border-wire-200 dark:border-wire-700">
              <span>New here? </span>
              <Link href="/signup" className="font-bold underline text-wire-900 dark:text-white">
                Sign up
              </Link>
            </div>

            <div className="bg-wire-100 dark:bg-wire-800 p-2.5 rounded text-center text-[11px] text-wire-600 dark:text-wire-400">
              Are you a mechanic?{" "}
              <button
                type="button"
                onClick={() => handleRoleToggle("mechanic")}
                className="underline font-bold text-wire-900 dark:text-white"
              >
                Mechanic login ›
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-wire-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
