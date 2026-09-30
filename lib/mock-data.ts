import { Vehicle, MechanicShop, ServiceBooking, CraneTowDispatch, MaintenanceTask } from "./types";

// Empty vehicles by default - users start fresh with no pre-entered car data
export const initialVehicles: Vehicle[] = [];

export const sampleMaintenanceTasks: MaintenanceTask[] = [];

// Certified garage partner network (verified independent workshops)
export const sampleMechanicShops: MechanicShop[] = [
  {
    id: "shop-1",
    name: "Workshop #1",
    rating: 4.8,
    reviewsCount: 142,
    distanceKm: 1.8,
    address: "Bypass Service Road, Near Junction #4",
    phone: "+91 98470 00001",
    isOpenNow: true,
    isEmergencyCapable: true,
    activeBays: 3,
    totalBays: 5,
    supportedMakes: ["All Major Brands", "Multi-Brand Certified"],
    services: [
      { id: "s-1", name: "Engine Oil & Filter Service", category: "Periodic", price: 350, durationMinutes: 30 },
      { id: "s-2", name: "Brake Pads Replacement (Front/Rear)", category: "Brakes", price: 400, durationMinutes: 45 },
      { id: "s-3", name: "Battery Jumpstart & Health Test", category: "Electrical", price: 200, durationMinutes: 20 },
      { id: "s-4", name: "Flat Tyre Puncture Repair & Inflate", category: "Tyres", price: 150, durationMinutes: 25 },
    ],
  },
  {
    id: "shop-2",
    name: "Workshop #2",
    rating: 4.9,
    reviewsCount: 210,
    distanceKm: 2.4,
    address: "Highway Junction Road, Sector 2",
    phone: "+91 98470 00002",
    isOpenNow: true,
    isEmergencyCapable: true,
    activeBays: 2,
    totalBays: 4,
    supportedMakes: ["All Major Brands", "Multi-Brand Certified"],
    services: [
      { id: "s-5", name: "General Service & Oil Flush", category: "Periodic", price: 400, durationMinutes: 45 },
      { id: "s-6", name: "Brake Disc Skimming & Lathe", category: "Brakes", price: 850, durationMinutes: 120 },
      { id: "s-7", name: "Coolant Flush & Radiator Inspection", category: "Engine", price: 350, durationMinutes: 40 },
    ],
  },
  {
    id: "shop-3",
    name: "Workshop #3",
    rating: 4.7,
    reviewsCount: 89,
    distanceKm: 4.5,
    address: "Airport Link Road, Industrial Area",
    phone: "+91 98470 00003",
    isOpenNow: false,
    isEmergencyCapable: false,
    activeBays: 4,
    totalBays: 4,
    supportedMakes: ["All Major Brands"],
    services: [
      { id: "s-8", name: "Comprehensive Diagnostics", category: "Electrical", price: 650, durationMinutes: 60 },
    ],
  },
];

// Empty bookings by default - no pre-entered dummy bookings
export const sampleBookings: ServiceBooking[] = [];

// Empty tow dispatches by default
export const sampleCraneDispatches: CraneTowDispatch[] = [];
