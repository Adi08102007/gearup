"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Vehicle, MechanicShop, ServiceBooking, CraneTowDispatch, MaintenanceTask, ServiceItem, User, UserRole } from "./types";
import { sampleMechanicShops } from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

interface AppContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  login: (role: UserRole, emailOrPhone: string, passwordOrOtp?: string) => Promise<boolean> | boolean;
  logout: () => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveVehicleId: (id: string) => void;
  maintenanceTasks: MaintenanceTask[];
  shops: MechanicShop[];
  bookings: ServiceBooking[];
  towDispatches: CraneTowDispatch[];
  isCloudConnected: boolean;
  addVehicle: (vehicle: Omit<Vehicle, "id" | "healthScore" | "lastServiceKm" | "nextServiceDueKm">) => Promise<void> | void;
  updateVehicleKm: (vehicleId: string, newKm: number) => Promise<void> | void;
  createBooking: (shopId: string, services: ServiceItem[], scheduledTime: string, notes?: string) => Promise<string> | string;
  updateBookingStatus: (bookingId: string, status: ServiceBooking["status"], notes?: string) => Promise<void> | void;
  logServiceOdometer: (bookingId: string, odometer: number, parts: { name: string; cost: number }[], labor: number) => Promise<void> | void;
  createTowDispatch: (data: { vehicleInfo: CraneTowDispatch["vehicleInfo"]; pickupAddress: string; destinationShopId: string; distanceKm: number }) => Promise<string> | string;
  updateTowStatus: (dispatchId: string, status: CraneTowDispatch["status"]) => Promise<void> | void;
  toggleTowPhoto: (dispatchId: string, angle: "front" | "rear" | "left" | "right") => Promise<void> | void;
  verifyTowOtp: (dispatchId: string, otp: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isCloud = isSupabaseConfigured();

  // 1. NO AUTO SIGN-IN: Default to null on website load
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Vehicles start empty by default (no pre-entered or seeded car data)
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_vehicles");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(vehicles[0]?.id || "");
  const [shops] = useState<MechanicShop[]>(sampleMechanicShops);

  // Bookings start empty
  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_bookings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [towDispatches, setTowDispatches] = useState<CraneTowDispatch[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_tow_dispatches");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Check real Supabase session on mount. User is logged out by default unless real session exists.
  useEffect(() => {
    async function checkSession() {
      if (supabase && isCloud) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const u = data.session.user;
            const role = (u.user_metadata?.role as UserRole) || "customer";
            setCurrentUser({
              id: u.id,
              name: u.user_metadata?.name || (role === "mechanic" ? "Workshop #1" : "Customer"),
              email: u.email || "",
              phone: u.phone || u.user_metadata?.phone || "",
              role,
            });
            setIsLoadingAuth(false);
            return;
          }
        } catch (e) {
          console.warn("Session check fallback:", e);
        }
      }

      // No real Supabase session exists: clear any test session data stored in localStorage or sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("gearup_user");
        sessionStorage.removeItem("gearup_user");
        sessionStorage.clear();
      }
      setCurrentUser(null);
      setIsLoadingAuth(false);
    }

    checkSession();
  }, [isCloud]);

  // Synchronize localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gearup_vehicles", JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gearup_bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gearup_tow_dispatches", JSON.stringify(towDispatches));
    }
  }, [towDispatches]);

  // Active Vehicle is user's own saved vehicle or null
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null;

  // Dynamic Maintenance Tasks calculated only from user's own saved vehicle km
  const maintenanceTasks: MaintenanceTask[] = activeVehicle
    ? [
        {
          id: "task-oil",
          vehicleId: activeVehicle.id,
          title: "Oil change & filter",
          intervalKm: 10000,
          lastDoneKm: activeVehicle.lastServiceKm,
          dueKm: activeVehicle.nextServiceDueKm,
          status:
            activeVehicle.currentKm >= activeVehicle.nextServiceDueKm
              ? "overdue"
              : activeVehicle.nextServiceDueKm - activeVehicle.currentKm <= 300
              ? "due_soon"
              : "good",
          estimatedCost: 1400,
          description: "Engine oil flush, OEM cartridge filter and seal ring.",
        },
        {
          id: "task-brakes",
          vehicleId: activeVehicle.id,
          title: "Brake pads inspection",
          intervalKm: 20000,
          lastDoneKm: Math.max(0, activeVehicle.currentKm - 5000),
          dueKm: activeVehicle.currentKm + 4200,
          status: "good",
          estimatedCost: 850,
          description: "Measure pad lining thickness and inspect disc rotor scoring.",
        },
        {
          id: "task-fluid",
          vehicleId: activeVehicle.id,
          title: "Brake fluid flush (DOT 4)",
          intervalKm: 30000,
          lastDoneKm: Math.max(0, activeVehicle.currentKm - 28000),
          dueKm: activeVehicle.currentKm + 2000,
          status: activeVehicle.currentKm >= 40000 ? "due_soon" : "good",
          estimatedCost: 650,
          description: "Moisture content check and hydraulic bleeding.",
        },
      ]
    : [];

  const login = (role: UserRole, emailOrPhone: string, passwordOrOtp?: string): boolean => {
    let name = "Customer";
    if (role === "mechanic") name = "Workshop #1";
    if (role === "crane") name = "Recovery Unit #1";

    const user: User = {
      id: `usr-${Date.now()}`,
      name,
      email: emailOrPhone.includes("@") ? emailOrPhone : `${role}@gearup.com`,
      phone: emailOrPhone.includes("@") ? "+91 90000 00000" : emailOrPhone,
      role,
    };

    setCurrentUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("gearup_user", JSON.stringify(user));
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("gearup_user");
      sessionStorage.clear();
    }
    if (supabase && isCloud) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const addVehicle = async (newVeh: Omit<Vehicle, "id" | "healthScore" | "lastServiceKm" | "nextServiceDueKm">) => {
    const id = `veh-${Date.now()}`;
    const vehicle: Vehicle = {
      ...newVeh,
      id,
      healthScore: 92,
      lastServiceKm: Math.max(0, newVeh.currentKm - 2000),
      nextServiceDueKm: newVeh.currentKm + 8000,
    };

    setVehicles((prev) => [vehicle, ...prev]);
    setActiveVehicleId(id);

    if (supabase && isCloud && currentUser) {
      try {
        await supabase.from("vehicles").insert({
          id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          reg_number: vehicle.regNumber,
          fuel_type: vehicle.fuelType,
          current_km: vehicle.currentKm,
          last_service_km: vehicle.lastServiceKm,
          next_service_due_km: vehicle.nextServiceDueKm,
          health_score: vehicle.healthScore,
          insurance_expiry: vehicle.insuranceExpiry || null,
          pollution_expiry: vehicle.pollutionExpiry || null,
        });
      } catch (e) {
        console.warn("Cloud vehicle write notice:", e);
      }
    }
  };

  const updateVehicleKm = async (vehicleId: string, newKm: number) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const delta = newKm - v.lastServiceKm;
          const score = Math.max(20, Math.min(100, Math.round(100 - (delta / 10000) * 40)));
          return { ...v, currentKm: newKm, healthScore: score };
        }
        return v;
      })
    );

    if (supabase && isCloud) {
      try {
        await supabase.from("vehicles").update({ current_km: newKm }).eq("id", vehicleId);
      } catch (e) {
        console.warn("Cloud km update notice:", e);
      }
    }
  };

  const createBooking = async (shopId: string, services: ServiceItem[], scheduledTime: string, notes?: string): Promise<string> => {
    const shop = shops.find((s) => s.id === shopId);
    const newId = `bk-${Date.now()}`;
    const newBooking: ServiceBooking = {
      id: newId,
      bookingNumber: `GU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || "cust-user",
      customerName: currentUser?.name || "Customer",
      customerPhone: currentUser?.phone || "+91 90000 00000",
      vehicle: {
        make: activeVehicle?.make || "Vehicle",
        model: activeVehicle?.model || "Model",
        regNumber: activeVehicle?.regNumber || "REG-0000",
        currentKm: activeVehicle?.currentKm || 0,
      },
      shopId,
      shopName: shop?.name || "Workshop #1",
      services,
      status: "pending",
      scheduledTime,
      laborCharge: services.reduce((acc, s) => acc + s.price, 0),
      notes,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      completionOtp: String(Math.floor(1000 + Math.random() * 9000)),
    };

    setBookings((prev) => [newBooking, ...prev]);

    if (supabase && isCloud) {
      try {
        await supabase.from("bookings").insert({
          id: newBooking.id,
          booking_number: newBooking.bookingNumber,
          customer_id: newBooking.customerId,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          vehicle_info: newBooking.vehicle,
          shop_id: newBooking.shopId,
          shop_name: newBooking.shopName,
          services: newBooking.services,
          status: newBooking.status,
          scheduled_time: newBooking.scheduledTime,
          labor_charge: newBooking.laborCharge,
          notes: newBooking.notes,
          completion_otp: newBooking.completionOtp,
        });
      } catch (e) {
        console.warn("Cloud booking insert notice:", e);
      }
    }

    return newId;
  };

  const updateBookingStatus = async (bookingId: string, status: ServiceBooking["status"], notes?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, ...(notes ? { notes } : {}) } : b))
    );

    if (supabase && isCloud) {
      try {
        await supabase.from("bookings").update({ status }).eq("id", bookingId);
      } catch (e) {
        console.warn("Cloud booking update notice:", e);
      }
    }
  };

  const logServiceOdometer = async (bookingId: string, odometer: number, parts: { name: string; cost: number }[], labor: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            loggedOdometer: odometer,
            partsReplaced: parts,
            laborCharge: labor,
            status: "ready_for_pickup",
          };
        }
        return b;
      })
    );

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.regNumber === booking.vehicle.regNumber) {
            return {
              ...v,
              currentKm: odometer,
              lastServiceKm: odometer,
              nextServiceDueKm: odometer + 10000,
              healthScore: 100,
            };
          }
          return v;
        })
      );
    }
  };

  const createTowDispatch = async (data: {
    vehicleInfo: CraneTowDispatch["vehicleInfo"];
    pickupAddress: string;
    destinationShopId: string;
    distanceKm: number;
  }): Promise<string> => {
    const shop = shops.find((s) => s.id === data.destinationShopId);
    const id = `tow-${Date.now()}`;
    const baseFare = 1500;
    const perKmRate = 65;
    const totalFare = Math.round(baseFare + data.distanceKm * perKmRate);

    const newDispatch: CraneTowDispatch = {
      id,
      dispatchNumber: `TOW-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerId: currentUser?.id || "cust-user",
      customerPhone: currentUser?.phone || "+91 90000 00000",
      vehicleInfo: data.vehicleInfo,
      pickupAddress: data.pickupAddress,
      destinationShopId: data.destinationShopId,
      destinationShopName: shop?.name || "Workshop #1",
      destinationAddress: shop?.address || "Bypass Service Road",
      distanceKm: data.distanceKm,
      baseFare,
      perKmRate,
      totalFare,
      status: "dispatched",
      photos: {},
      handoverOtp: String(Math.floor(1000 + Math.random() * 9000)),
      driverName: "Recovery Unit #1",
      driverPhone: "+91 98460 00001",
      truckPlate: "KL-07-EE-9090",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setTowDispatches((prev) => [newDispatch, ...prev]);
    return id;
  };

  const updateTowStatus = async (dispatchId: string, status: CraneTowDispatch["status"]) => {
    setTowDispatches((prev) =>
      prev.map((t) => (t.id === dispatchId ? { ...t, status } : t))
    );
  };

  const toggleTowPhoto = async (dispatchId: string, angle: "front" | "rear" | "left" | "right") => {
    setTowDispatches((prev) =>
      prev.map((t) => {
        if (t.id === dispatchId) {
          return {
            ...t,
            photos: {
              ...t.photos,
              [angle]: !t.photos[angle],
            },
          };
        }
        return t;
      })
    );
  };

  const verifyTowOtp = (dispatchId: string, otp: string): boolean => {
    const target = towDispatches.find((t) => t.id === dispatchId);
    if (target && target.handoverOtp === otp.trim()) {
      updateTowStatus(dispatchId, "completed");
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoadingAuth,
        login,
        logout,
        vehicles,
        activeVehicle,
        setActiveVehicleId,
        maintenanceTasks,
        shops,
        bookings,
        towDispatches,
        isCloudConnected: isCloud,
        addVehicle,
        updateVehicleKm,
        createBooking,
        updateBookingStatus,
        logServiceOdometer,
        createTowDispatch,
        updateTowStatus,
        toggleTowPhoto,
        verifyTowOtp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
