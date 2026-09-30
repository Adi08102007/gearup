# GearUp — Mechanic Wireframe Specifications & Documentation (v1.1)

## Overview & Purpose
The Mechanic Portal for GearUp is designed to empower garage owners and mobile technicians to:
- Receive high-intent breakdown and scheduled maintenance requests.
- Accept jobs with a single tap within a 2-3 minute decision window.
- Track job statuses accurately across Onsite (mobile van) and Offsite (in-garage) service models.
- Maintain permanent, verifiable service logs with **mandatory odometer readings**.
- Publish transparent parts catalogs and labor rates.
- Collect verified reviews from completed jobs to establish reputation and trust.
- *(Note: All crane operator workflows are decoupled from the mechanic side).*

---

## 1. Global Wireframe & UX Principles

### 1.1 Visual Styling & Theming
- **Grayscale Wireframe Foundation**: Clean borders (`border-slate-300`), white and neutral gray surfaces, monospace typography for technical data (odometer, registration numbers, timestamps, coordinates, prices).
- **Single Accent Color for Status Badges**:
  - `Emerald` / Green: Online, Available, Approved, Verified Badge, 1-Tap Accept.
  - `Amber` / Orange: Busy, In Review, Pending Verification, Custom Issue / Needs Quote.
  - `Red` / Crimson: Emergency Breakdown, Timer Countdown Expiring, Reject / Decline.
  - `Blue` / Sky: Onsite Mobile Service, Active Travel, In-transit GPS.
  - `Purple`: Offsite Workshop Facility, Garage Bay.
- **Strict Privacy & Anonymity**: No personal names or real people images (`"Customer"`, `"Your name"`, `"Workshop Name #1"`, `"Technician #1"`).
- **Status Indication Rule**: Status is ALWAYS represented with **both color and text/icon** (e.g. `[🟢 Available]`, `[🟡 Busy]`, `[⚪ Offline]`).

---

## 2. Logged-Out Architecture & Onboarding

### 2.1 Single Top Bar (Logged-Out)
- Only ONE top bar is rendered:
  - `GearUp Logo` (with `FOR MECHANICS` badge)
  - `[🌐 EN ▾]` Language Switcher
  - `[Login]` button
  - `[Sign up as Partner]` button
- Free from customer navigation links, notification bells, profile menus, or fake user data.

### 2.2 Mechanic Login
- Visibly distinct layout from customer login: Split two-column card featuring Partner Portal perks on the left and login credentials on the right.
- **Login Options**: Password login or 6-digit SMS/Email OTP login.
- Features: Show/hide password eye toggle, "Forgot password?" link, "Remember this workshop terminal" checkbox, and a direct link: *"Not a mechanic? Customer login ›"*.

### 2.3 Mechanic Sign Up (5-Step Progress Stepper)
1. **Step 1: Partner Personal Details** — Legal name, mobile phone (for dispatch SMS), email address, secure password.
2. **Step 2: Shop Details** — Registered garage name, street address, interactive map pin / GPS coordinates, opening and closing hours.
3. **Step 3: Services & Pricing (Redrawn)** — Searchable checklist of services offered with base labor rates, Onsite and Offsite service mode checkboxes, onsite service radius (in km), and base visit charge (₹). *(Crane recovery option is completely excluded).*
4. **Step 4: Business Verification** — Trade license / government registration certificate upload, shop front photo placeholder with visible signboard.
5. **Step 5: Review & Submit** — Partner summary, acceptance of the GearUp Partner Code of Conduct (upfront pricing, mandatory odometer logging), ending in the "Pending Verification" screen.

### 2.4 Forgot Password Flow
- 4-stage recovery flow: Email/Phone entry ➔ 6-digit OTP verification ➔ New password creation ➔ Success confirmation.

### 2.5 Pending Verification State
- If the account is pending verification, a persistent amber banner is displayed: *"Account Pending Verification: Documents under review. Accepting customer requests is disabled."*
- Prohibits accepting incoming customer breakdown requests while allowing the mechanic to configure their price catalog, parts list, and working hours.

---

## 3. Logged-In Operations & Navigation

### 3.1 Sidebar & Top Bar Structure
- **Desktop Sidebar**:
  - Operations: `Dashboard`, `Incoming Requests` (with live count badge), `Active Bookings`, `Log Service`.
  - Shop Management: `Services & Prices`, `Service Logs`, `Reviews`, `Earnings`, `Availability`, `Shop Profile` (`VERIFIED` badge).
  - Quick Toggle: `Auto-Busy Mode` checkbox.
- **Top Bar**:
  - `Status Switch`: Three-state toggle `[ (•) Available | Busy | Offline ]`.
  - Confirmation modals for going offline while having active jobs or rejecting a breakdown call.
  - Notifications bell with unread count (`3`).
  - Workshop Profile dropdown.
- **Mobile Breakpoint**:
  - Fixed bottom navigation bar with 5 primary touch targets (`Dashboard`, `Requests`, `Bookings`, `Log`, `More`).
  - Slide-out drawer for secondary management items.

---

## 4. Redrawn Pages & Key Specifications (Zero Crane)

### 4.1 Mechanic Dashboard (Redrawn)
- **Big Status Switch**: Prominent banner showing current state (`ONLINE & ACCEPTING`, `BUSY ON JOB`, `OFFLINE`).
- **Today's Summary Metrics (4 Cards)**:
  1. *New Requests*: Count with remaining countdown timer.
  2. *Active Jobs*: Count split by Onsite vs In Garage.
  3. *Completed Today*: Count with average turnaround time.
  4. *Today's Earnings*: Gross revenue with daily trend.
- **Priority Emergency Card**: Pinned incoming breakdown card with live timer.
- **Two-Column Section**: Active / upcoming scheduled jobs list + Recent verified reviews snippet. (Zero crane badges or cards).

### 4.2 Incoming Requests (Redrawn)
- **Request Card Information**:
  - Customer distance in km (calculated from shop GPS).
  - Mode badge (`[🚐 Onsite]` vs `[🏢 Offsite]`).
  - Urgency pill (`[🚨 Emergency Breakdown]`, `[Today]`, `[Later]`).
  - Vehicle specifications: Model, color, registration number, estimated odometer.
  - Ticked checklist items (standard repairs) + Custom customer notes highlighted in amber as `⚠️ Needs inspection`.
  - Estimated payout preview (e.g. `₹650 (Visit ₹150 + Labor)`).
- **Fast Response Mechanism**:
  - Prominent 2-3 minute countdown timer.
  - Single-tap `[Accept Job Now ➔]` button (automatically sets status to Busy).
  - `[Reject / Pass]` button with confirmation modal and optional reason dropdown.
  - **Auto-Forwarding**: If the timer expires before acceptance, the system automatically forwards the request to the next nearest available mechanic.

### 4.3 Booking Details (Redrawn — No Crane Button)
- **Customer Contact**: Customer name, phone number, and one-tap `[📞 Call]` action.
- **Job Status Progression Stepper**:
  - *Onsite Flow (5 Stages)*: `Accepted` ➔ `On the way` ➔ `Arrived` ➔ `In service` ➔ `Completed`.
  - *Offsite Flow (4 Stages)*: `Accepted` ➔ `Vehicle received` ➔ `In service` ➔ `Completed`.
- **Navigation & Map**: Route preview with travel distance in km, ETA, and "Open in Google Maps" action (or workshop bay assignment for offsite).
- **Technician Incident Pro Tools**:
  - `Suggest a Change / Add Price Quote`: Opens modal to submit extra faults and price quotes for digital customer approval.
  - *(Crane request button is completely removed).*

### 4.4 Log Service (Job Completion Screen)
- Opens automatically when marking a job complete.
- **Mandatory Odometer Input**: Prominent input field requiring verified vehicle odometer km before the service can be finalized.
- **Work Checklist**: Multi-select checklist of services performed.
- **Parts & Materials Used**: Dynamic table with Part Description, Quantity, Unit Price, and Subtotal.
- **Extra Issues Found**: Shows customer digital approval status for added services.
- **Mechanic Diagnostic Notes & Photos**: Advice to vehicle owner and photo upload placeholders (odometer, replaced parts).
- **Live Invoice Preview**: Grand total breakdown (Labor + Parts + Visit fee + Taxes — zero crane fees) with `[Finalize & Send Bill to Customer ✓]` CTA.
- **Sync Effect**: Completing this log immediately updates the customer's permanent vehicle logbook and recalculates future km-based maintenance predictions.

### 4.5 Services & Prices Catalog (Redrawn)
- Standard labor rates configuration with edit options.
- Parts catalog management (add, edit, remove).
- Base visit charge and onsite service radius in km.
- Onsite and Offsite service acceptance toggles. (Zero crane services).

### 4.6 Service Logs & History
- Comprehensive historical logbook of all completed jobs.
- Search by customer, vehicle, or invoice number.
- Filters: Date range, service type, and service mode (Onsite/Offsite).
- Expandable rows detailing parts used, labor fees, and recorded odometer readings.
- `[📄 Download Tax Invoice]` action.

### 4.7 Verified Reviews
- Overall star rating summary (e.g. `4.9 ★ based on 48 jobs`).
- Strictly displays verified reviews from customers with completed jobs.
- Official workshop reply feature allowing public responses directly under reviews.

### 4.8 Earnings & Payouts
- Summary toggles for Today, This Week, and This Month.
- Wireframe bar chart illustrating weekly payout trends.
- Transparent fee breakdown showing 0% commission on emergency breakdown calls.

### 4.9 Availability Settings
- Standard weekly opening and closing hours.
- Smart auto-busy toggle when starting an active job.
- Workshop holiday/scheduled closed mode.

### 4.10 Shop Profile & Verification (Redrawn)
- Public workshop profile details (GPS pin, address, working hours, shop photos: Front, Bay, Van).
- Display of `GEARUP VERIFIED PARTNER` badge and verified trade licenses. (Zero crane badges or recovery equipment listings).
