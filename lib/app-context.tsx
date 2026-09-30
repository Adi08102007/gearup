"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Vehicle, MechanicShop, ServiceBooking, CraneTowDispatch, MaintenanceTask, ServiceItem, User, UserRole } from "./types";
import { initialVehicles, sampleMaintenanceTasks, sampleMechanicShops, sampleBookings, sampleCraneDispatches } from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

interface AppContextType {
  currentUser: User | null;
  login: (role: UserRole, phoneOrEmail: string, passwordOrOtp?: string) => boolean;
  logout: () => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle;
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

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_user");
      if (saved) return JSON.parse(saved);
    }
    return {
      id: "usr-demo-1",
      name: "Amaljith (Owner)",
      email: "amaljith@gearup.com",
      phone: "+91 98950 12345",
      role: "customer",
      vehicleId: "veh-1",
    };
  });

  const login = (role: UserRole, phoneOrEmail: string, passwordOrOtp?: string): boolean => {
    let user: User;
    if (role === "customer") {
      user = {
        id: "usr-cust-1",
        name: "Amaljith (Owner)",
        email: phoneOrEmail.includes("@") ? phoneOrEmail : "owner@gearup.com",
        phone: phoneOrEmail.includes("@") ? "+91 98950 12345" : phoneOrEmail,
        role: "customer",
        vehicleId: "veh-1",
      };
    } else if (role === "mechanic") {
      user = {
        id: "usr-mech-1",
        name: "Apex Auto Master Tech",
        email: phoneOrEmail.includes("@") ? phoneOrEmail : "service@apexauto.in",
        phone: phoneOrEmail.includes("@") ? "+91 98470 11223" : phoneOrEmail,
        role: "mechanic",
        shopId: "shop-1",
      };
    } else {
      user = {
        id: "usr-crane-1",
        name: "Highway Unit #4 Driver",
        email: phoneOrEmail.includes("@") ? phoneOrEmail : "recovery4@keralatow.com",
        phone: phoneOrEmail.includes("@") ? "+91 98460 77112" : phoneOrEmail,
        role: "crane",
        truckPlate: "KL 07 CW 9901",
      };
    }
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
    }
  };

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_vehicles");
      if (saved) return JSON.parse(saved);
    }
    return initialVehicles;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(vehicles[0]?.id || "veh-1");
  const [maintenanceTasks] = useState<MaintenanceTask[]>(sampleMaintenanceTasks);
  const [shops] = useState<MechanicShop[]>(sampleMechanicShops);

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_bookings");
      if (saved) return JSON.parse(saved);
    }
    return sampleBookings;
  });

  const [towDispatches, setTowDispatches] = useState<CraneTowDispatch[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gearup_tow_dispatches");
      if (saved) return JSON.parse(saved);
    }
    return sampleCraneDispatches;
  });

  // Fetch from Supabase on mount if cloud credentials configured
  const syncWithSupabase = useCallback(async () => {
    if (!supabase || !isCloud) return;

    try {
      // 1. Fetch vehicles
      const { data: vehData } = await supabase.from("vehicles").select("*");
      if (vehData && vehData.length > 0) {
        const mappedVehicles: Vehicle[] = vehData.map((v) => ({
          id: v.id,
          make: v.make,
          model: v.model,
          year: v.year,
          regNumber: v.reg_number,
          fuelType: v.fuel_type,
          currentKm: v.current_km,
          lastServiceKm: v.last_service_km,
          nextServiceDueKm: v.next_service_due_km,
          healthScore: v.health_score,
          insuranceExpiry: v.insurance_expiry,
          pollutionExpiry: v.pollution_expiry,
        }));
        setVehicles(mappedVehicles);
      }

      // 2. Fetch bookings
      const { data: bkData } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (bkData && bkData.length > 0) {
        const mappedBookings: ServiceBooking[] = bkData.map((b) => ({
          id: b.id,
          bookingNumber: b.booking_number,
          customerId: b.customer_id,
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          vehicle: b.vehicle_info,
          shopId: b.shop_id,
          shopName: b.shop_name,
          services: b.services,
          status: b.status,
          scheduledTime: b.scheduled_time,
          loggedOdometer: b.logged_odometer,
          partsReplaced: b.parts_replaced,
          laborCharge: b.labor_charge,
          notes: b.notes,
          completionOtp: b.completion_otp,
          createdAt: b.created_at,
        }));
        setBookings(mappedBookings);
      }

      // 3. Fetch tow dispatches
      const { data: towData } = await supabase.from("tow_dispatches").select("*").order("created_at", { ascending: false });
      if (towData && towData.length > 0) {
        const mappedTows: CraneTowDispatch[] = towData.map((t) => ({
          id: t.id,
          dispatchNumber: t.dispatch_number,
          customerId: t.customer_id,
          customerPhone: t.customer_phone,
          vehicleInfo: t.vehicle_info,
          pickupAddress: t.pickup_address,
          destinationShopId: t.destination_shop_id,
          destinationShopName: t.destination_shop_name,
          destinationAddress: t.destination_address,
          distanceKm: t.distance_km,
          baseFare: t.base_fare,
          perKmRate: t.per_km_rate,
          totalFare: t.total_fare,
          status: t.status,
          photos: t.photos || {},
          handoverOtp: t.handover_otp,
          driverName: t.driver_name,
          driverPhone: t.driver_phone,
          truckPlate: t.truck_plate,
          createdAt: t.created_at,
        }));
        setTowDispatches(mappedTows);
      }
    } catch (err) {
      console.warn("Supabase fetch notice: using local cached state.", err);
    }
  }, [isCloud]);

  useEffect(() => {
    syncWithSupabase();

    if (!supabase || !isCloud) return;

    // Realtime WebSocket channel listening to PostgreSQL table changes
    const channel = supabase
      .channel("gearup-realtime-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        syncWithSupabase();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "vehicles" }, () => {
        syncWithSupabase();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tow_dispatches" }, () => {
        syncWithSupabase();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [syncWithSupabase, isCloud]);

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

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || initialVehicles[0];

  const addVehicle = async (newVeh: Omit<Vehicle, "id" | "healthScore" | "lastServiceKm" | "nextServiceDueKm">) => {
    const id = `veh-${Date.now()}`;
    const vehicle: Vehicle = {
      ...newVeh,
      id,
      healthScore: 90,
      lastServiceKm: Math.max(0, newVeh.currentKm - 2000),
      nextServiceDueKm: newVeh.currentKm + 8000,
    };

    setVehicles((prev) => [vehicle, ...prev]);
    setActiveVehicleId(id);

    if (supabase && isCloud) {
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
          insurance_expiry: vehicle.insuranceExpiry,
          pollution_expiry: vehicle.pollutionExpiry,
        });
      } catch (e) {
        console.warn("Cloud write fallback:", e);
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
        const v = vehicles.find((v) => v.id === vehicleId);
        if (v) {
          const delta = newKm - v.lastServiceKm;
          const score = Math.max(20, Math.min(100, Math.round(100 - (delta / 10000) * 40)));
          await supabase.from("vehicles").update({ current_km: newKm, health_score: score }).eq("id", vehicleId);
        }
      } catch (e) {
        console.warn("Cloud write fallback:", e);
      }
    }
  };

  const createBooking = async (shopId: string, services: ServiceItem[], scheduledTime: string, notes?: string): Promise<string> => {
    const shop = shops.find((s) => s.id === shopId);
    const newId = `bk-${Date.now()}`;
    const newBooking: ServiceBooking = {
      id: newId,
      bookingNumber: `GU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "cust-current",
      customerName: "Vehicle Owner (You)",
      customerPhone: "+91 98470 55443",
      vehicle: {
        make: activeVehicle.make,
        model: activeVehicle.model,
        regNumber: activeVehicle.regNumber,
        currentKm: activeVehicle.currentKm,
      },
      shopId,
      shopName: shop?.name || "Auto Repair Centre",
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
        console.warn("Cloud write fallback:", e);
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
        await supabase.from("bookings").update({ status, ...(notes ? { notes } : {}) }).eq("id", bookingId);
      } catch (e) {
        console.warn("Cloud write fallback:", e);
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
              healthScore: 98,
            };
          }
          return v;
        })
      );

      if (supabase && isCloud) {
        try {
          await supabase.from("bookings").update({
            logged_odometer: odometer,
            parts_replaced: parts,
            labor_charge: labor,
            status: "ready_for_pickup",
          }).eq("id", bookingId);

          await supabase.from("vehicles").update({
            current_km: odometer,
            last_service_km: odometer,
            next_service_due_km: odometer + 10000,
            health_score: 98,
          }).eq("reg_number", booking.vehicle.regNumber);
        } catch (e) {
          console.warn("Cloud write fallback:", e);
        }
      }
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
      customerId: "cust-current",
      customerPhone: "+91 98470 55443",
      vehicleInfo: data.vehicleInfo,
      pickupAddress: data.pickupAddress,
      destinationShopId: data.destinationShopId,
      destinationShopName: shop?.name || "Partner Repair Yard",
      destinationAddress: shop?.address || "Highway Service Depot",
      distanceKm: data.distanceKm,
      baseFare,
      perKmRate,
      totalFare,
      status: "dispatched",
      photos: {},
      handoverOtp: String(Math.floor(1000 + Math.random() * 9000)),
      driverName: "Emergency Response Crane #3",
      driverPhone: "+91 98460 11998",
      truckPlate: "KL 07 DE 3311",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setTowDispatches((prev) => [newDispatch, ...prev]);

    if (supabase && isCloud) {
      try {
        await supabase.from("tow_dispatches").insert({
          id: newDispatch.id,
          dispatch_number: newDispatch.dispatchNumber,
          customer_id: newDispatch.customerId,
          customer_phone: newDispatch.customerPhone,
          vehicle_info: newDispatch.vehicleInfo,
          pickup_address: newDispatch.pickupAddress,
          destination_shop_id: newDispatch.destinationShopId,
          destination_shop_name: newDispatch.destinationShopName,
          destination_address: newDispatch.destinationAddress,
          distance_km: newDispatch.distanceKm,
          base_fare: newDispatch.baseFare,
          per_km_rate: newDispatch.perKmRate,
          total_fare: newDispatch.totalFare,
          status: newDispatch.status,
          photos: newDispatch.photos,
          handover_otp: newDispatch.handoverOtp,
          driver_name: newDispatch.driverName,
          driver_phone: newDispatch.driverPhone,
          truck_plate: newDispatch.truckPlate,
        });
      } catch (e) {
        console.warn("Cloud write fallback:", e);
      }
    }

    return id;
  };

  const updateTowStatus = async (dispatchId: string, status: CraneTowDispatch["status"]) => {
    setTowDispatches((prev) =>
      prev.map((t) => (t.id === dispatchId ? { ...t, status } : t))
    );

    if (supabase && isCloud) {
      try {
        await supabase.from("tow_dispatches").update({ status }).eq("id", dispatchId);
      } catch (e) {
        console.warn("Cloud write fallback:", e);
      }
    }
  };

  const toggleTowPhoto = async (dispatchId: string, angle: "front" | "rear" | "left" | "right") => {
    let updatedPhotos = {};
    setTowDispatches((prev) =>
      prev.map((t) => {
        if (t.id === dispatchId) {
          updatedPhotos = {
            ...t.photos,
            [angle]: !t.photos[angle],
          };
          return {
            ...t,
            photos: updatedPhotos,
          };
        }
        return t;
      })
    );

    if (supabase && isCloud) {
      try {
        await supabase.from("tow_dispatches").update({ photos: updatedPhotos }).eq("id", dispatchId);
      } catch (e) {
        console.warn("Cloud write fallback:", e);
      }
    }
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
