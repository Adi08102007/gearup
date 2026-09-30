# GearUp — Customer Wireframe Specifications (Version 2.1)

## Global Privacy & Wireframe Convention
- **No Real or Personal Names**: Strictly generic placeholders are used throughout the application (`"Customer"`, `"Your name"`, `"Mechanic name"`, `"Workshop name #1"`, `"Technician #1"`).
- **Generic Profile Menu**: Displays a neutral avatar icon `[👤]` with label `"Profile"` or `"Customer"`, never a person's name.

---

## 1. Top Bar & Authentication State Architecture

### 1.1 Logged-Out State (Landing Page, Login, Sign Up, Forgot Password)
- **Single Clean Top Bar**: Only ONE bar is rendered.
  - Contains strictly: `GearUp Logo`, `[Login]` button, `[Sign up]` button, and `[🌐 EN ▾]` Language switch.
  - **Removed from logged-out pages**:
    - Vehicle selector chip
    - Navigation menu items (Find Mechanic, Crane, My Vehicles, Service History, Bookings)
    - Notification bell
    - Profile menu
    - Floating Emergency SOS button
    - All mock/user data (names, vehicles, notification counters)
- **Breakdown CTA Guard**:
  - The hero card *"Vehicle broke down? Get help now"* remains prominently positioned.
  - Tapping it when logged out triggers an authentication modal or routes to Login/Sign up with an emergency notice: *"Please log in or sign up first to dispatch emergency roadside service."*

### 1.2 Add First Vehicle Page (Post-Signup Onboarding)
- **Minimal Top Bar**: Contains strictly the `GearUp Logo` and a `"Skip for now ›"` action.
- **Hidden Elements**: Top navigation menu, notification bell, profile menu, and floating Emergency button are completely hidden on this screen.
- **Form Fields (Completely Blank by Default)**:
  - Registration number: Empty with placeholder (e.g. `e.g. KL-07-CC-1234`)
  - Brand & Model: Empty with placeholder (e.g. `e.g. Swift Dzire, Classic 350`)
  - Current Odometer: Empty with placeholder (e.g. `e.g. 45000`)
- **Vehicle Type Cards**: Three options (`Car`, `Two-Wheeler`, `Commercial`) with **none selected by default**.
- **Odometer Helper Note**: Directly beneath the km input: *"We use this to remind you when maintenance is due"*.
- **Post-Save Behavior**: The customer dashboard shows vehicle details and maintenance schedules only after a vehicle is saved here or from the My Vehicles screen.

### 1.3 Logged-In State (Dashboard, Vehicles, Booking, History, etc.)
- **Navigation Bar (NO VEHICLE CHIP ANYWHERE)**:
  - Top bar contains strictly: `GearUp Logo`, `Find Mechanic`, `Crane`, `My Vehicles`, `Service History`, `Bookings`, `[🌐 Language]`, `[🔔 Notifications (2)]`, `[👤 Profile ▾]`.
  - Zero vehicle registration numbers or odometer values appear in the top bar across desktop, tablet, or mobile.
- **Placement of Vehicle Details in Page Content**:
  - **Dashboard**: Prominent vehicle card displaying vehicle info, current odometer reading, inline `[Update km]` button, and km-based maintenance list.
  - **My Vehicles**: Full vehicle cards with maintenance rows, primary status badge, and edit/delete actions.
  - **Booking Flow Step 1**: Radio card vehicle selector to select which registered car/bike to book for.
  - **Service History**: Pinned dropdown selector at the top of the history page (`[🚗 Vehicle 1 (KL-07-CC-1234) ▾]`).
- **Floating Emergency Action**: Fixed at bottom-right of all logged-in views: `[🚨 Emergency]`.

---

## 2. Find Mechanic: Unselected Mode First

### 2.1 Step 1: Service Mode Choice (Large Cards)
When the customer initiates *"Find Mechanic"*, they are presented with a dedicated mode-selection screen:
- **Card 1: Onsite**
  - Title: **Onsite**
  - Tagline: *"Mechanic comes to my location"*
  - Description: *"A mobile technician van travels to your current breakdown spot, home, or office with tools and equipment."*
  - **Unselected by default**.
- **Card 2: Offsite**
  - Title: **Offsite**
  - Tagline: *"I will visit the workshop"*
  - Description: *"Drive or drop off your vehicle at a certified local garage or workshop facility."*
  - **Unselected by default**.
- **Primary CTA**: `[Continue to Mechanics ➔]`
  - **Disabled by default**: Styled with neutral background and `cursor-not-allowed` until the user selects either Onsite or Offsite.

### 2.2 Step 2: Filtered Results & Top Mode Switcher
- After selecting a mode, the mechanic list and map display results already filtered for that mode.
- **Top Toggle**: A compact toggle `[🚐 Onsite]` | `[🏢 Offsite]` remains pinned to the top of the results, allowing immediate switching without backing out.
- **Mode-Specific Card Details**:
  - **Onsite Results**: Show **Visit charge** (e.g. `₹150`), **Estimated arrival time** (e.g. `15-20 mins`), and mobile van capability.
  - **Offsite Results**: Show **Workshop address** (e.g. `Service Road, Junction #4`), **Distance in km** (e.g. `2.4 km`), and **Next available time slots** (e.g. `Today 2:30 PM`).

---

## 3. Vehicle Health: Km-Based Maintenance Lists (No Percentages)

### 3.1 Strict Rule: Zero Percentages
- All percentage indicators (e.g. "12% oil life", "78% brake pads") are removed completely.
- Both the **Customer Dashboard** and **My Vehicles** page display a structured maintenance list per vehicle.

### 3.2 List Format & Attributes
Each maintenance item row displays:
1. **Service Name**: (e.g., `Oil change`, `Brake pads`, `Chain lubrication`)
2. **Due-In-Km Value**: (e.g., `due in 250 km`, `overdue by 120 km`)
3. **Status Label (Text + Icon)**:
   - `[✓ OK]` — Due in > 300 km
   - `[⚠️ Due soon]` — Due in $\le 300\text{ km}$
   - `[🚨 Overdue]` — Odometer has surpassed recommended interval
4. **Last-Serviced Km**: (e.g., `Last done at 35,500 km`)
5. **Action Button**: Direct `[Book]` button for items marked *Due soon* or *Overdue*.

### 3.3 Odometer Km Updater
- Prominent current odometer reading: `45,210 km`
- Inline input and `[Update km]` button to adjust mileage anytime.

---

## 4. Service History: Refined Logbook

### 4.1 Header & Vehicle Selector
- Vehicle selector at the top (`[🚗 Vehicle 1 (KL-07-CC-1234) ▾]`).
- Quick export actions: `[📄 Export Full History]` and `[🖨️ Print]`.

### 4.2 Summary Cards (4 Metrics)
- **Total Services**: e.g., `8 Services`
- **Total Spent**: e.g., `₹14,850` (Labor + parts)
- **Last Service Date**: e.g., `24 Aug 2026`
- **Current km**: e.g., `45,210 km`

### 4.3 Filter Toolbar
- Search input: *"Search service, invoice #, part..."*
- Dropdown filters: `Date Range`, `Service Type`, `Mode (Onsite / Offsite)`, `Mechanic / Workshop`.

### 4.4 Timeline Grouped by Month (Collapsed & Expanded Cards)
- Grouped by month headings (e.g., `August 2026`, `February 2026`).
- **Collapsed Card**:
  - Date (`24 Aug 2026`), Mechanic Name (`Workshop name #1`), Mode badge (`[🚐 Onsite]`), Odometer (`40,120 km`), Total cost (`₹2,450`), and `[Expand ▼]`.
- **Expanded Card**:
  - Checklist items done (e.g. `✓ Synthetic Oil Flush`, `✓ Oil Filter`, `✓ Multi-point Inspection`)
  - Parts used with unit price (e.g. `Synthetic Oil 5W-30 (3.5L @ ₹450/L): ₹1,575`, `OEM Oil Filter: ₹325`)
  - Cost breakdown: `Labor cost (₹400)`, `Visit charge (₹150)`, `Crane fare (₹0)`, `Total (₹2,450)`
  - Notes from the mechanic: Diagnostic observations and advice
  - Extra issues found & approval status: (e.g., `Approved: Battery terminal cleaned`)
  - Rating given: Star rating + feedback sentiment tag
  - Primary actions: `[📄 Download Invoice]` and `[🔄 Book Again]`

### 4.5 Upcoming Next-Service Section
- Forecast cards in *"due in km"* format:
  - `Oil change & filter`: due in 250 km (Due soon) `[Book Service]`
  - `Brake pads inspection`: due in 4,200 km (OK) `[Book Ahead]`
  - `Coolant replacement`: due in 9,500 km (OK) `[Schedule]`

### 4.6 Empty State
- Dedicated empty state for newly added vehicles without service logs:
  - Icon + headline: *"No services yet. Book your first service."*
  - CTA button: `[Book First Service]`.

---

## 5. Responsive Layout Matrix (Desktop, Tablet, Mobile)

| Page | Desktop (1280px) | Tablet (768px) | Mobile (390px) |
| :--- | :--- | :--- | :--- |
| **Landing** | Single logged-out top bar, dual search, 3-col how-it-works, 5-col features | Single logged-out bar, stacked search, 2-col features | Pinned emergency hero, 1-col cards, bottom footer links |
| **Login / Sign Up** | Centered clean card (450px wide) | Centered card (90% width) | Full-width mobile form with 48px touch inputs |
| **Add First Vehicle** | Minimal top bar (Logo + Skip), centered card, 3 type cards | Minimal top bar, centered card, 3 type cards | Minimal top bar, full-width card, vertical or wrapped type cards |
| **Find Mechanic** | Step 1: 2 unselected cards + disabled CTA. Step 2: 3-col filter + 5-col cards + 4-col live map | Step 1: 2 stacked cards. Step 2: 2-col cards with collapsable filter drawer | Step 1: full-width cards. Step 2: Segmented `[List]` / `[Map]` tabs |
| **Dashboard** | 7-col recent bookings + 5-col km health list (vehicle card) | Stacked 1-col sections | Single-column feed with quick action pills |
| **My Vehicles** | 2-col vehicle cards with inline km updater & status rows | 1-col full-width vehicle cards | Vertical card stack with direct `[Book]` buttons |
| **Service History** | Top vehicle dropdown, 4 summary metric cards, inline filter bar, monthly timeline | 2x2 metric cards, wrapped filter bar | 2x2 compact metric cards, monthly accordion list |
