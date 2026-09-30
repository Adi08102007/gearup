import Link from "next/link";
import { Car, Wrench, Truck, ArrowRight, ShieldCheck, Clock, Zap, MapPin } from "lucide-react";

export default function HomePage() {
  const portals = [
    {
      title: "Customer Portal",
      badge: "Vehicle Owners",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      description: "Manage maintenance schedules by odometer, find verified local workshops, and request instant emergency towing.",
      href: "/customer",
      icon: Car,
      accent: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      features: [
        "Live Odometer & Service Tracker",
        "Transparent Workshop Price Estimates",
        "1-Tap Highway Emergency SOS Tow",
        "Digital Vehicle Maintenance Log",
      ],
      cta: "Open Customer Portal",
      ctaBg: "bg-blue-600 hover:bg-blue-500 text-white",
    },
    {
      title: "Mechanic Portal",
      badge: "Garages & Techs",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      description: "Workshop management dashboard. Accept incoming service bookings within 2 minutes, manage repair bays, and log odometer readings.",
      href: "/mechanic",
      icon: Wrench,
      accent: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      features: [
        "Incoming Bookings with 2-min Countdown",
        "4-Stage Repair Stepper & Bay Assignment",
        "Mandatory Service Odometer Logging",
        "Decoupled from Tow Operations",
      ],
      cta: "Open Mechanic Portal",
      ctaBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
    {
      title: "Crane Operator Portal",
      badge: "Recovery Fleet",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      description: "Dedicated highway recovery & flatbed fleet portal. Real-time tow dispatches, 4-angle photo damage checks, and OTP customer handover.",
      href: "/crane",
      icon: Truck,
      accent: "hover:border-amber-500/40 hover:shadow-amber-500/5",
      features: [
        "Live Highway Emergency Dispatches",
        "Transparent Base + Per-KM Rate Formula",
        "4-Angle Pre-Tow Damage Photo Checklist",
        "Garage Drop-Off Handover with OTP",
      ],
      cta: "Open Crane Portal",
      ctaBg: "bg-amber-600 hover:bg-amber-500 text-white",
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Next.js 15 App Architecture • 3 Unified Portals</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          The Connected Automotive <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
            Care & Recovery Platform
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          One system connecting everyday motorists with certified independent garages and on-demand heavy recovery crane fleets.
        </p>
      </div>

      {/* 3 Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <div
              key={portal.title}
              className={`flex flex-col justify-between p-6 rounded-2xl bg-[#0f1422] border border-slate-800 transition-all duration-300 shadow-lg ${portal.accent}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${portal.badgeColor}`}>
                    {portal.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">{portal.title}</h2>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/70">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Core Capabilities:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {portal.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={portal.href}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-md ${portal.ctaBg}`}
                >
                  <span>{portal.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0d121f] border border-slate-800 text-center">
        <div>
          <div className="text-2xl font-bold text-emerald-400">100%</div>
          <div className="text-xs text-slate-400 mt-0.5">Decoupled Architecture</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">&lt; 15 min</div>
          <div className="text-xs text-slate-400 mt-0.5">Average Crane Dispatch</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">2 min</div>
          <div className="text-xs text-slate-400 mt-0.5">Mechanic SLA Acceptance</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">OTP-Secured</div>
          <div className="text-xs text-slate-400 mt-0.5">Drop-off & Handover</div>
        </div>
      </div>
    </div>
  );
}
