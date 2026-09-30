export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";

export type UserRole = "customer" | "mechanic" | "crane";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  shopId?: string;
  vehicleId?: string;
  truckPlate?: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  regNumber: string;
  fuelType: FuelType;
  currentKm: number;
  lastServiceKm: number;
  nextServiceDueKm: number;
  healthScore: number; // 0 - 100
  insuranceExpiry: string;
  pollutionExpiry: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string;
  intervalKm: number;
  lastDoneKm: number;
  dueKm: number;
  status: "good" | "due_soon" | "overdue";
  estimatedCost: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: "Periodic" | "Brakes" | "Engine" | "Suspension" | "Electrical" | "Tyres";
  price: number;
  durationMinutes: number;
  description?: string;
}

export interface MechanicShop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  phone: string;
  isOpenNow: boolean;
  isEmergencyCapable: boolean;
  activeBays: number;
  totalBays: number;
  services: ServiceItem[];
  supportedMakes: string[];
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicle: {
    make: string;
    model: string;
    regNumber: string;
    currentKm: number;
  };
  shopId: string;
  shopName: string;
  services: ServiceItem[];
  status: "pending" | "accepted" | "in_progress" | "ready_for_pickup" | "completed" | "declined";
  scheduledTime: string;
  loggedOdometer?: number;
  partsReplaced?: { name: string; cost: number }[];
  laborCharge: number;
  notes?: string;
  createdAt: string;
  completionOtp?: string;
}

export type TowCondition = "rolls_freely" | "wheels_locked" | "severe_damage" | "off_road";

export interface CraneTowDispatch {
  id: string;
  dispatchNumber: string;
  customerId: string;
  customerPhone: string;
  vehicleInfo: {
    make: string;
    model: string;
    regNumber: string;
    condition: TowCondition;
  };
  pickupAddress: string;
  pickupCoordinates?: { lat: number; lng: number };
  destinationShopId: string;
  destinationShopName: string;
  destinationAddress: string;
  distanceKm: number;
  baseFare: number;
  perKmRate: number;
  totalFare: number;
  status: "searching" | "dispatched" | "en_route" | "arrived" | "loaded" | "handover_pending" | "completed";
  photos: {
    front?: boolean;
    rear?: boolean;
    left?: boolean;
    right?: boolean;
  };
  handoverOtp: string;
  driverName: string;
  driverPhone: string;
  truckPlate: string;
  createdAt: string;
}
