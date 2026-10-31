# MedSupply Direct — B2B Wholesale Medical Consumables & Equipment Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, clinical-grade B2B wholesale ordering web application built for healthcare procurement directors, hospital supply chain officers, and community pharmacy managers. MedSupply Direct enables medical institutions to requisition consumables and critical equipment in volume, benefit from dynamic tiered pricing, parse bulk ERP SKU lists, track cold-chain logistics in real time, and manage Net-30 invoicing with full institutional compliance.

---

## 1. Project Overview

Medical procurement requires high density, precision, and trust. Unlike generic marketing e-commerce storefronts, **MedSupply Direct** is engineered from the ground up as an enterprise transactional workspace. It mirrors the exact operational workflows used by major healthcare systems (such as NHS Trusts, private clinic networks, and diagnostic laboratories), including:

- **Tiered Volume Pricing**: Automatic unit price reductions as batch quantities cross volume thresholds (e.g., 1–9, 10–49, 50–199, 200+ units), with real-time margin savings calculations.
- **Fast Bulk Entry**: Instant SKU-quantity text parser (`GLV-NIT-M-100, 50`) and drag-and-drop CSV template importer for ERP inventory reorders.
- **Standing Orders & Department Templates**: Pre-curated ward lists (e.g. *"ICU Monthly Restock"*, *"Surgical Suite 3 Consumables"*, *"Crash Cart Refills"*) that replenish wholesale carts in a single click.
- **Cold-Chain & Telemetry Tracking**: Step-by-step dispatch tracking (*Placed* → *Confirmed* → *Packed* → *Shipped* → *Delivered*) with an interactive simulation engine to demonstrate live milestone progression during walkthroughs.
- **Commercial Net-30 Invoicing**: PO number tracking, VAT healthcare exemption, print-ready tax receipts, and payment reconciliation.

---

## 2. Key Features

### 🏥 Dashboard Overview
- **Procurement Telemetry**: Real-time KPI counters tracking active in-flight orders, month-to-date spend against credit ceilings, distributor stock shortages, and pending Net-30 invoices.
- **Spend Trajectory Chart**: Interactive Recharts area chart visualising monthly procurement expenditure across consumables, diagnostics, and monitoring equipment.
- **Quick Restock Strip**: One-click restocking for frequently purchased ward consumables with pre-negotiated volume tiers.
- **Distributor Bulletins**: Live regulatory feeds (EU-MDR renewals, Q4 volume rebate notifications, seasonal diagnostic combo kit stock arrivals).
- **Recent Orders Table**: Instant access to PO tracking, delivery estimates, and waybill numbers.

### 📦 60-Item Medical Catalog
- **8 Comprehensive Medical Categories**:
  1. *Gloves and PPE*: Powder-free nitrile exam gloves (S, M, L), sterile surgical neoprene gloves, AAMI Level 3 gowns, N95 respirators, visors, shoe covers, bouffant caps.
  2. *Syringes and Needles*: Luer-lock syringes (3mL, 5mL, 10mL, 20mL), safety needles (21G, 23G, 25G), blunt fill needles with 5µm filter, insulin syringes, IV catheters, enteral syringes.
  3. *Wound Care*: 8-ply sterile gauze swabs, sacral hydrocolloid dressings, cohesive bandages, calcium alginate silver dressings, polyglactin 910 absorbable sutures, microporous surgical tape, sterile skin closure strips, 2% chlorhexidine swabs.
  4. *Diagnostics & Test Kits*: Rapid SARS-CoV-2 / Flu A+B combo kits, hospital blood glucose strips, 10SG urinalysis strips, Strep A rapid tests, fingertip OLED pulse oximeters, high-sensitivity Troponin I POC cassettes, FIT colorectal screening kits, H. pylori antigen tests.
  5. *Surgical Instruments*: Carbon steel scalpel blades (#10, #11, #15), Mayo straight dissecting scissors (AISI 420 steel), Adson micro tissue forceps 1×2, sterile suture removal packs, mosquito hemostats, Cusco vaginal speculums, tungsten carbide needle holders.
  6. *Lab Consumables*: Vacutainer blood collection tubes (K2-EDTA lavender, SST gold, Sodium Citrate blue), 100mL sterile specimen cups (95 kPa leak-proof), aerosol barrier filter pipette tips (200µL), 50mL conical centrifuge tubes, frosted microscope slides, 90mm petri dishes, viral transport media (VTM).
  7. *Monitoring Equipment*: Z-fold ECG red grid chart paper, disposable NIBP adult cuffs, ThermoScan Pro 6000 tympanic thermometers and hygienic probe covers, radiolucent ECG electrodes, SpO2 reusable finger sensors, capnography sidestream sample lines, jet nebulizer masks.
  8. *Hygiene & Sanitisers*: CaviWipes bleach hospital disinfectant wipes, 70% IPA clinical spray, 4% chlorhexidine surgical scrub, WHO Formula 1 touchless gel refills, triple-enzymatic instrument detergent, UN-certified biohazard autoclave sacks, Class 5 steam chemical integrator strips.
- **Multi-Faceted Left Filter Panel**: Filter by category, manufacturer brand, maximum price ceiling slider, in-stock status, sterility (EtO/Gamma), and prescription/controlled requirements.
- **Dual View Modes**: Switch seamlessly between a high-density card grid and an institutional tabular spreadsheet.
- **Inline Quantity Steppers**: Adjust order quantities directly in the catalog without opening individual product pages.

### 🔍 Product Detail & Dynamic Tier Pricing
- **Interactive Tier Table**: Highlights the active volume tier as quantity shifts, calculates exact unit cost and total discount savings, and displays prompt upsell notices (e.g., *"Order 10 more boxes to unlock 23% off"*).
- **Clinical Specifications**: Technical attributes including sterilization method, shelf life, regulatory classification, and storage temperature requirements.
- **Regulatory Certifications**: Verified badges for CE 0123, ISO 13485:2016, FDA 510(k), and AAMI standards.
- **Document Downloads**: Simulated downloads for Technical Data Sheets (TDS) and Safety Data Sheets (SDS).
- **Save to Standing Order List**: Add products directly to named departmental replenishment templates.

### 🛒 Wholesale Cart & Bulk Entry
- **Side Slide-Over Drawer + Full Cart Page**: Real-time line-level tier price recalculation, subtotal breakdown, free freight logic (free for orders > $500), and NHS tax exemption handling.
- **Paste SKUs & Quantities Modal**: Paste raw ERP requisition lists (e.g., `GLV-NIT-M-100, 50`) with immediate regex parsing, validation, and batch cart addition.
- **CSV Upload Modal**: Download standard CSV ordering templates or upload pre-formatted procurement manifests with automatic SKU recognition.
- **Receiving Dock Notes**: Special instructions field for delivery drivers and dock receiving staff.

### 💳 3-Step Checkout
- **Step 1: Receiving Dock & Logistics Window**: Select from saved institutional facilities and pick delivery windows (Standard Freight, Temperature-Controlled Cold Chain 2°C–8°C, or Urgent Morning Dispatch).
- **Step 2: Commercial Terms & PO Input**: Choose between *Invoice Net-30*, *Direct Bank Wire (BACS)*, or *Corporate P-Card*, and assign custom hospital PO numbers.
- **Step 3: Order Confirmation**: Generates a unique tracking reference (`MSD-2026-XXXX`), estimated delivery date, allocated item breakdown, and links directly to live tracking.

### 🚚 Orders & Live Dispatch Simulation
- **Visual Progress Stepper**: 5 distinct fulfillment stages (*Placed* → *Confirmed* → *Packed* → *Shipped* → *Delivered*).
- **Live Status Simulation Engine**: Click **"Simulate Next Stage"** on any active order to test state advancement during walkthroughs and watch the timeline update in real time.
- **Waybill & Custody Log**: Courier details (MedCarrier Express Logistics), vehicle numbers, GPS datalogger status, and dock drop-off timestamps.
- **1-Click Reorder All**: Re-populates the cart with all items and quantities from any previous purchase order.
- **Printable Tax Invoices**: Print-friendly CSS (`@media print`) hides navigation sidebars and headers, producing a clean, clinical tax receipt.

### 📋 Standing Orders (Saved Lists)
- Create and manage recurring templates (e.g., *"ICU Monthly Restock"*, *"Crash Cart Refills"*).
- Configure restocking frequencies (*Weekly*, *Bi-weekly*, *Monthly*, *Manual*).
- One-click **"Add All to Wholesale Cart"** to eliminate repetitive re-keying of standard product orders.

### 📑 Invoices & Statements
- Full accounts payable ledger with *Paid*, *Pending Net-30*, and *Overdue* status indicators.
- Summary metrics for YTD billing, reconciled amounts, and available credit.
- Tax invoice preview modal with remittance details (Barclays Corporate Health BACS instructions).

### 🏢 Organization & Team Settings
- Switch between institutional profiles: **Hospital**, **Pharmacy**, and **Clinic** to experience custom tax exemptions and credit lines.
- Team member permissions directory with role badges (*Procurement Director*, *Chief Medical Officer*, *Theatre Nurse Lead*, *Accounts Payable*).
- Invite team member modal and receiving dock address directory.

### ⌨️ Global Command Palette (Cmd+K / Ctrl+K)
- Fast keyboard-accessible overlay to instantly search across all 60 products, active orders, standing lists, and billing ledgers.

---

## 3. Visual Design System

The application adheres to a light, clinical, modern SaaS design language:
- **Primary Trust Teal**: `#0E9AA7` (Buttons, active states, brand marks)
- **Soft Sky Blue Surfaces**: `#E6F4FA` (Active selections, highlights, callouts)
- **Deep Navy Text**: `#12304A` (High contrast AA legibility for clinical reading)
- **Alert Coral**: `#F26B5B` (Reserved exclusively for low stock warnings and errors)
- **Success Emerald**: `#10B981` (In-stock chips, completed delivery milestones, verified credentials)
- **Typography**: `Plus Jakarta Sans` for clean, professional display and body text paired with `JetBrains Mono` for tabular numerals, SKUs, and financial quantities.
- **Anti-Slop Discipline**: No decorative pulsing dots, zero unnecessary pill badges on static metadata, and clean unboxed labels separated by typographic dividers.

---

## 4. Tech Stack

- **Framework**: React 19 + TypeScript (ES2022)
- **Bundler & Dev Server**: Vite 8.3
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` with custom theme tokens)
- **Routing**: React Router (`react-router-dom` v7)
- **Icons**: `lucide-react`
- **Charts**: `recharts` (Responsive Area Chart for spend analytics)
- **State & Storage**: React Context API + typed `localStorage` persistence layer

---

## 5. Folder Structure

```
├── /public/
│   └── favicon.svg                  # Teal medical cross favicon
├── /src/
│   ├── types/
│   │   └── index.ts                 # Full TypeScript domain models
│   ├── data/
│   │   ├── mockProducts.ts          # 60 medical products across 8 categories
│   │   └── mockInitialData.ts       # Initial orders, invoices, lists, bulletins
│   ├── context/
│   │   ├── AuthContext.tsx          # User profile, organization mode, login
│   │   ├── CartContext.tsx          # Cart items, dynamic tier pricing, bulk add
│   │   ├── OrderContext.tsx         # Orders, status simulation, saved lists
│   │   └── ToastContext.tsx         # Global toast notifications
│   ├── components/
│   │   ├── common/
│   │   │   ├── StockBadge.tsx       # Accessible stock status indicator
│   │   │   ├── TierPriceTable.tsx   # Interactive tiered pricing component
│   │   │   ├── SkeletonLoader.tsx   # Simulated loading skeletons
│   │   │   └── ProductImageIllustration.tsx # Medical category SVG illustrations
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx       # Slide-out wholesale cart drawer
│   │   │   ├── QuickSkuAddModal.tsx # Paste SKUs and quantities modal
│   │   │   └── CsvUploadModal.tsx   # CSV template download and importer
│   │   └── layout/
│   │       ├── AppLayout.tsx        # Main application layout wrapper
│   │       ├── Sidebar.tsx          # Desktop left sidebar with credit meter
│   │       ├── TopBar.tsx           # 3-zone header with search & org switcher
│   │       ├── MobileNav.tsx        # Responsive mobile bottom navigation bar
│   │       └── CommandPalette.tsx   # Cmd+K / Ctrl+K global search palette
│   ├── pages/
│   │   ├── AuthPage.tsx             # Sign-in and organization onboarding
│   │   ├── DashboardPage.tsx        # KPI cards, spend chart, bulletins, reorder
│   │   ├── CatalogPage.tsx          # 60 products, multi-filters, grid/table
│   │   ├── ProductDetailPage.tsx    # Technical specs, tier table, related items
│   │   ├── CartPage.tsx             # Full cart review, dock notes, discounts
│   │   ├── CheckoutPage.tsx         # 3-step checkout wizard with Net-30 PO
│   │   ├── OrdersPage.tsx           # Order tracking table with filters
│   │   ├── OrderDetailPage.tsx      # Milestone stepper, waybill, status simulation
│   │   ├── SavedListsPage.tsx       # Departmental standing order templates
│   │   ├── InvoicesPage.tsx         # Accounts payable statements and slips
│   │   ├── AccountPage.tsx          # Facility profile, team roles, delivery bays
│   │   ├── SupportPage.tsx          # Clinical FAQ accordions and validated form
│   │   └── NotFoundPage.tsx         # 404 error page
│   ├── App.tsx                      # Root component with providers and routes
│   ├── index.css                    # Tailwind v4 configuration & print CSS
│   └── main.tsx                     # Entry point mounting root
├── index.html                       # HTML head with Plus Jakarta Sans & favicon
├── metadata.json                    # AI Studio applet metadata
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository and navigate into directory
cd medsupply-direct

# Install dependencies
npm install

# Start the local development server (runs on port 3000)
npm run dev
```

Open your browser at `http://localhost:3000`.

### Building for Production
```bash
# Type check and build distribution assets
npm run build

# Preview production build locally
npm run preview
```

---

## 7. How the Mock Data & Persistence Layer Work

MedSupply Direct uses a robust, typed mock data layer coupled with client-side `localStorage` caching:
1. **Initial Hydration**: If no stored data exists in `localStorage`, default clinical profiles, 60 realistic medical products, active in-transit orders, past invoices, and department standing lists are initialized from `src/data/mockInitialData.ts` and `src/data/mockProducts.ts`.
2. **Persistent Cart**: Adding items, modifying quantities, or parsing SKUs updates `medsupply_cart_items` in `localStorage`, retaining cart state across page reloads and browser sessions.
3. **Persistent Orders & Simulation**: When a user completes checkout, a new order object (e.g. `MSD-2026-XXXX`) and corresponding Net-30 invoice (`INV-2026-XXXX`) are appended to `medsupply_orders_list` and `medsupply_invoices_list`. Clicking **"Simulate Next Stage"** updates the order's timeline and persists its new status (`Packed` → `Shipped` → `Delivered`).
4. **Live Price Recalculation**: The helper function `getEffectiveUnitPrice(product, quantity)` dynamically evaluates the product's tier matrix and computes unit prices, total savings, and line totals instantaneously.

---

## 8. Demo Login Notes

The authentication system operates in **Mock Demo Mode**:
- **Accepts Any Credentials**: You can enter any mock email and password on `/login`.
- **1-Click Demo Profiles**: Three quick buttons are provided on the login page:
  - **Hospital**: *St. Jude Metropolitan Hospital* (Eleanor Vance, $120k credit line, Dock 4B)
  - **Pharmacy**: *Apex Care Community Pharmacy Group* ($45k credit line)
  - **Clinic**: *Wellspring Ambulatory Surgery & Family Clinic* ($30k credit line)
- Switching the active organization from the TopBar or Account tab automatically adjusts credit facility limits and VAT exemption profiles.

---

## 9. Future Roadmap

1. **Real EDI / ERP Integration**: Direct AS2 / HL7 / FHIR connectors to hospital ERPs (e.g., SAP Healthcare, Epic Willow, Oracle Health / Cerner) to sync purchase orders and inventory decrements automatically.
2. **Real-Time Warehouse Inventory API**: WebSocket connections to distributor automated picking systems (such as AutoStore or Swisslog) for live bin availability.
3. **Barcoding & Mobile Scanning App**: Camera-based barcode scanner PWA for hospital ward nurses to scan empty consumable boxes at the shelf to auto-generate replenishment drafts.
4. **Automated BACS / ACH Direct Debit & Virtual Cards**: Integrated Stripe / Adyen Corporate issuing APIs for automated Net-30 direct debit settlements.
5. **Granular RBAC & Multi-Level PO Approvals**: Hierarchical approval workflows where department requisitions over $5,000 automatically route to the Chief Medical Officer or Finance Director before dispatch.
