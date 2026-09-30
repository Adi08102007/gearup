"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { UserRole } from "@/lib/types";
import { Car, Wrench, Truck, ShieldCheck, ArrowRight, Phone, Lock, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useApp();

  const [activeRole, setActiveRole] = useState<UserRole>("customer");
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [identifier, setIdentifier] = useState("+91 98950 12345");
  const [password, setPassword] = useState("••••••••");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const roles = [
    {
      id: "customer" as UserRole,
      title: "Vehicle Owner",
      subtitle: "Customer Space",
      icon: Car,
      accent: "from-blue-600 to-indigo-600",
      pill: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      defaultContact: "+91 98950 12345",
      dest: "/customer",
      desc: "Manage car health, track km schedules, book verified garages & request highway tows.",
    },
    {
      id: "mechanic" as UserRole,
      title: "Certified Garage",
      subtitle: "Mechanic Portal",
      icon: Wrench,
      accent: "from-emerald-600 to-teal-600",
      pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      defaultContact: "+91 98470 11223",
      dest: "/mechanic",
      desc: "Receive incoming 2-min bookings, assign repair bays & log odometer readings.",
    },
    {
      id: "crane" as UserRole,
      title: "Recovery Fleet",
      subtitle: "Crane Operator",
      icon: Truck,
      accent: "from-amber-600 to-orange-600",
      pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      defaultContact: "+91 98460 77112",
      dest: "/crane",
      desc: "Highway flatbed dispatches, 4-angle photo damage inspections & OTP drop-offs.",
    },
  ];

  const currentRoleConfig = roles.find((r) => r.id === activeRole) || roles[0];

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setOtpSent(false);
    setErrorMsg("");
    const cfg = roles.find((r) => r.id === role);
    if (cfg) setIdentifier(cfg.defaultContact);
  };

  const handleSendOtp = () => {
    if (!identifier) {
      setErrorMsg("Please enter your phone number or email");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode("4821"); // Simulated OTP
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const success = login(activeRole, identifier, otpSent ? otpCode : password);
      setIsLoading(false);
      if (success) {
        router.push(currentRoleConfig.dest);
      } else {
        setErrorMsg("Authentication failed. Please verify credentials.");
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const cfg = roles.find((r) => r.id === role);
    if (!cfg) return;
    setIsLoading(true);
    setTimeout(() => {
      login(role, cfg.defaultContact, "demo-pass");
      setIsLoading(false);
      router.push(cfg.dest);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Role-Based Authentication System</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Sign In to GearUp</h1>
        <p className="text-sm text-slate-400">
          Choose your account type to access your dedicated automotive operations workspace
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = activeRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRoleChange(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-[#141b2d] border-slate-600 shadow-xl ring-2 ring-emerald-500/30"
                  : "bg-[#0d121f] border-slate-800/80 hover:border-slate-700 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${r.pill}`}>
                  {r.subtitle}
                </span>
              </div>
              <div className="mt-3 font-bold text-sm text-white">{r.title}</div>
            </button>
          );
        })}
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1422] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Login as {currentRoleConfig.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{currentRoleConfig.desc}</p>
          </div>

          {/* Toggle between OTP and Password */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode("otp")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                authMode === "otp" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                authMode === "password" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Password
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone or Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Registered Mobile Number or Email</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98000 00000 or email@domain.com"
                className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
              />
              {authMode === "otp" && !otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>

          {/* OTP Input or Password Input */}
          {authMode === "otp" ? (
            otpSent && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Enter 4-Digit Verification Code</label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="4-digit OTP"
                  className="w-full bg-[#131929] border border-emerald-500/60 text-white text-lg tracking-widest font-mono text-center rounded-xl py-2.5 outline-none"
                />
                <p className="text-[11px] text-emerald-400 text-center">
                  ✓ Demo simulation: Verification code autofilled ({otpCode})
                </p>
              </div>
            )
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#131929] border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (authMode === "otp" && !otpSent)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Authenticating..." : `Sign In as ${currentRoleConfig.title}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Tap Quick Demo Access */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Evaluator / Demo 1-Tap Quick Access:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("customer")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">Owner Account</div>
                <div className="text-[10px] text-slate-500">Amaljith (Polo GT)</div>
              </div>
              <Car className="w-4 h-4 text-blue-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("mechanic")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">Garage Manager</div>
                <div className="text-[10px] text-slate-500">Apex Auto Precision</div>
              </div>
              <Wrench className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("crane")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">Crane Fleet Driver</div>
                <div className="text-[10px] text-slate-500">Unit #4 Flatbed</div>
              </div>
              <Truck className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
