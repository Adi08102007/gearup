# GearUp — Crane & Tow Truck Operator Wireframe Specifications (v1.0)

## Overview & Purpose
The Crane & Tow Truck Operator Portal for GearUp is designed to empower emergency vehicle recovery fleets, flatbed operators, and towing services to:
- Receive high-intent roadside breakdown recovery orders from stranded motorists and partner mechanics.
- Accept recovery dispatches with a single tap within a 1:45 minute window.
- Execute a structured **5-stage recovery lifecycle**: `Accepted` ➔ `En Route to Scene` ➔ `Loaded / Hooked` ➔ `In Transit` ➔ `Delivered & Handed Over`.
- Protect operators through mandatory **pre-hookup 4-angle damage inspection photos**.
- Bill accurately using a transparent **Base Hookup + Per-Km transit rate + Toll claims** model.
- Hand over recovered vehicles securely to receiving garages or owners using digital OTP confirmation.

---

## 1. Global Wireframe & UX Principles

### 1.1 Visual Styling & Theming
- **Grayscale Wireframe Foundation**: Clean borders (`border-slate-300`), white and neutral gray surfaces, monospace typography for technical data (registration plates, winching tonnage, odometer km, GPS coordinates, fares).
- **Single Accent Color for Status Badges**:
  - `Amber` / Gold: Primary Crane Identity, Towing in Progress, Loaded on Bed.
  - `Emerald` / Green: On-Duty, Online, 1-Tap Accept, OTP Confirmed, Payout Released.
  - `Red` / Crimson: Urgent Highway Breakdown, Countdown Timer Expiring, Decline / Pass.
  - `Slate` / Neutral: Off-Duty, Collapsed Records, History Logs.
- **Strict Privacy & Anonymity**: No personal names or real people images (`"Motorist"`, `"Customer"`, `"Recovery Unit #1"`, `"Workshop #1"`).
- **Duty Indication Rule**: Status is ALWAYS represented with **both color and text/icon** (`[🟢 On-Duty]`, `[🟡 Towing]`, `[⚪ Off-Duty]`).

---

## 2. Logged-Out Architecture & Onboarding

### 2.1 Single Top Bar (Logged-Out)
- Only ONE top bar is rendered:
  - `GearUp Logo` (with `CRANE & TOWING` badge)
  - `[🌐 EN ▾]` Language Switcher
  - `[Operator Login]` button
  - `[Sign Up Fleet Truck]` button
- Free from customer navigation links, notification bells, profile menus, or fake user data.

### 2.2 Operator Login
- Professional recovery portal layout with value propositions on the left and credentials on the right.
- Password login or 6-digit SMS OTP option.
- "Stay logged in on this vehicle unit", show/hide password toggle, and forgot password flow.

### 2.3 Crane Partner Sign Up (5-Step Progress Stepper)
1. **Step 1: Driver / Agency Details** — Legal name, dispatch mobile number, commercial heavy vehicle driving license number, access password.
2. **Step 2: Truck Specifications** — Truck type selector (`Hydraulic Flatbed (3.5T)`, `Wheel-Lift Underlift (2.5T)`, `Heavy Boom Crane (10T+)`), vehicle registration number, hydraulic winch rating, home yard depot address.
3. **Step 3: Rates & Service Radius** — Base hookup fare (₹1,200 including first 5 km), per-km rate (₹60/km), maximum dispatch radius (in km), and nighttime standby surcharge toggle (+25%).
4. **Step 4: RTO Verification** — RTO commercial tow truck fitness certificate (Form 38) upload, truck front and hydraulic bed photo.
5. **Step 5: Review & Code of Conduct** — Partner review, acceptance of pre-tow damage photography requirements, submitting into "Pending Verification" state.

### 2.4 Forgot Password Flow
- 4-stage recovery flow: Mobile entry ➔ 6-digit OTP ➔ New password ➔ Success confirmation.

### 2.5 Pending Verification State
- In review status with amber banner: *"Commercial Tow Truck Verification in Progress"*.
- Disables receiving live breakdown dispatch orders until RTO fitness and winch certifications are audited.

---

## 3. Logged-In Operations & Navigation

### 3.1 Sidebar & Top Bar Structure
- **Desktop Sidebar**:
  - Operations: `Fleet Dashboard`, `Tow Requests` (with live count badge), `Active Recovery`, `Complete Handover`.
  - Fleet & Earnings: `Rates & Tow Radius`, `Trip Logs`, `Driver Reviews`, `Towing Earnings`, `Duty Hours`, `Truck & Permits` (`VERIFIED` badge).
  - Quick Toggle: `24/7 Night Standby` checkbox (+25% surcharge).
- **Top Bar**:
  - `Duty Switch`: Three-state toggle `[ (•) On-Duty | Towing | Off-Duty ]`.
  - Confirmation modal before going off-duty when breakdown requests are nearby.
  - Notifications bell with unread count (`2`).
  - Unit Profile dropdown.
- **Mobile Breakpoint**:
  - Fixed bottom navigation bar with 5 primary touch targets (`Dashboard`, `Requests`, `Tow Job`, `Handover`, `More`).
  - Slide-out drawer for secondary fleet items.

---

## 4. Key Page Specifications

### 4.1 Fleet Dashboard
- **Duty Banner**: Prominent status indicator (`ON-DUTY & BROADCASTING`, `TOWING IN TRANSIT`, `OFF-DUTY`).
- **4 Key Metrics**:
  1. *New Tow Requests*: Count with remaining countdown timer.
  2. *Active Recovery*: Current vehicle and progression stage.
  3. *Vehicles Towed Today*: Daily trip count and transit km.
  4. *Today's Tow Revenue*: Gross payout with toll claims breakdown.
- **Priority Highway Dispatch Card**: Live emergency request card with distance, vehicle condition, and guaranteed fare.

### 4.2 Incoming Tow Requests
- **Request Card Information**:
  - Customer distance in km (from truck's live GPS).
  - Recovery type requirement (`🛏️ Flatbed Required` for locked automatic/EV vs `🚜 Wheel-Lift`).
  - Vehicle details: Make, model, registration plate, condition note (*"Transmission locked • Cannot roll"*).
  - Transit route: Pickup point on highway ➔ Destination certified garage.
  - Guaranteed fare breakdown: Base hookup + transit mileage.
- **Fast Response Mechanism**:
  - Prominent 1:45 minute countdown timer.
  - Single-tap `[Accept Tow Job ➔]` button (switches status to Towing).
  - `[Reject / Pass]` button with auto-forwarding to the next nearest recovery unit upon timer expiry.

### 4.3 Active Recovery Job (5-Stage Lifecycle)
- **5-Stage Stepper**:
  1. `Accepted`: Dispatch confirmed, GPS route to scene opens.
  2. `En Route`: Motorist tracks flatbed truck approaching.
  3. `Loaded / Hooked`: Winch hookup complete.
  4. `In Transit`: Vehicle on rollback bed, driving to destination garage.
  5. `Delivered`: Arrived at garage bay, ready for handover.
- **Mandatory Pre-Hookup Damage Documentation**:
  - 4-point photo upload slots: Front Bumper, Left Flank, Rear Bumper, Right Flank. Protects the operator against liability for pre-existing accident dents.

### 4.4 Vehicle Handover & Trip Completion
- **Mileage Audit**: Start km, end km, total towed distance.
- **Toll Claims**: Reimbursement entry for FASTag highway toll receipts.
- **Digital Handover OTP**: 4-digit security code provided by the receiving garage technician or vehicle owner to confirm safe delivery.
- **Instant Payout Release**: Detailed invoice (Base + Distance + Tolls) with instant wallet payout credit.

### 4.5 Rates & Tow Radius Settings
- Base hookup fare and included distance (e.g. ₹1,200 for first 5 km).
- Additional per-km rate (e.g. ₹60/km).
- Service radius boundary in km (e.g. 40 km highway coverage).

### 4.6 Trip Logs & Recovery Invoices
- Searchable log of past tows with date, vehicle, towed distance, and total fee.
- Downloadable tax invoices for insurance claims.

### 4.7 Verified Driver Reviews
- Star rating summary (e.g. `4.9 ★`) from completed emergency recovery jobs.

### 4.8 Towing Earnings & Toll Claims
- Today, This Week, and This Month payout analytics with toll reimbursements.

### 4.9 Duty Hours & Standby
- Scheduled duty hours and 24/7 night emergency standby rules.

### 4.10 Truck & Permits Profile
- Truck specs, winch tonnage rating, RTO commercial fitness certificate (Form 38), and yellow commercial registration plate.
