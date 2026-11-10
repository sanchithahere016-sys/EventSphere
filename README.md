# EventSphere – Community-Based Local Event Discovery & Trust Engine

> **Tagline:** *"Discover Events. Build Trust. Connect Communities."*  
> **Type:** Engineering College Community Innovation Project  
> **Primary Innovation:** Community-Powered Event Trust Engine  

---

## 1. Project Overview

**EventSphere** is a community-driven web application designed to solve the critical problems of phantom events, misleading venues, duplicate listings, and unauthorized ticket scams that plague college campuses and local communities.

Unlike standard event boards that publish any unverified submission, EventSphere features an algorithmic **Community-Powered Event Trust Engine**. Every listing undergoes multi-factor evaluation incorporating organizer credentials, community endorsements, supporting official documentation, and chronological schedule consistency to generate an objective, transparent **Trust Score (0–100%)**.

To preserve institutional integrity, EventSphere enforces a fundamental safeguard: **A High Trust Score does NOT equate to automatic verification.** Only designated **College Administrators** can audit official evidence and grant the coveted **Verified** badge, which unlocks the event's unique **QR Attendance Pass**.

---

## 2. Key Modules & Features

### 🛡️ Module A: Community-Powered Event Trust Engine (Core Innovation)
Every event is evaluated across four transparent weighted pillars using the mathematical formula:

$$\text{Trust Score} = (0.30 \times \text{Organizer Credibility}) + (0.30 \times \text{Community Confirmation}) + (0.25 \times \text{Evidence Quality}) + (0.15 \times \text{Details Consistency})$$

| Component | Weight | Criteria & Factors |
| :--- | :---: | :--- |
| **Organizer Credibility** | **30%** | Institutional email domain (`.edu`, `.ac.in`), Dean-approved organizer badge, historical count of completed events, and absence of disciplinary flags. |
| **Community Confirmation** | **30%** | Crowdsourced validation by authenticated campus members. Self-confirmations are blocked. Significant deductions are triggered by community red-flag reports. |
| **Evidence Quality** | **25%** | High-resolution official creative poster, attached faculty/Dean sanction letters or auditorium reservation vouchers, and valid direct phone/email contact. |
| **Details Consistency** | **15%** | Chronological validity ($\text{Start Time} < \text{End Time}$), realistic future date, detailed description agenda (>100 characters), and explicit campus hall/room designation. |

**Score Interpretation Thresholds:**
- 🟢 **80–100%: High Trust** — Exceptional evidence, verified organizer, strong community backing.
- 🟡 **50–79%: Moderate Trust** — Legitimate details; awaiting additional confirmations or administrative review.
- 🔴 **0–49%: Low Trust** — Missing documentation, unverified identity, or reported by community members.

---

### 🔍 Module B: Event Discovery & Interactive Mapping
- **Search & Filters:** Real-time search across titles, descriptions, clubs, and venues.
- **8 Categories:** *College Events, Workshops, Cultural Events, Sports, Technology, Music, Volunteering, Community Meetups*.
- **Interactive OpenStreetMap:** Leaflet map with custom color-coded map pins (Verified = Green, High Trust = Blue, Moderate = Amber, Low = Red) and interactive popups.
- **Multiple Views:** Seamless toggle between Grid View and Map View.
- **Sorting Options:** By Highest Trust Score, Most Confirmations, Soonest Calendar Date, or Most Checked-In.

---

### 📝 Module C: Event Submission & Verification Pipeline
- Strict field validation prevents incomplete submissions.
- Upload support for official creative posters and institutional approval documents (PDF/images).
- **Initial Status:** All new submissions enter **`Pending Verification`** status.
- Immediate dynamic Trust Score computation upon submission.

---

### ⚡ Module D: Smart Duplicate Event Detector
- Compares prospective submissions against existing listings using token-based Jaccard similarity and Levenshtein distance on title, date, venue, and organizer identity.
- Displays a prominent alert warning:
  > *"A similar event may already exist. Please review the existing listing before submitting."*
- Enables side-by-side comparison before submitting and flags duplicate candidates for Administrator resolution without destructive automatic deletion.

---

### 👥 Module E: Crowdsourced Community Validation & Reporting
- Authenticated users can endorse event accuracy with optional observational notes.
- **Strict Anti-Manipulation Guards:**
  - Users cannot confirm the same event multiple times.
  - Organizers are strictly blocked from confirming their own events.
- **Dispute Reporting:** Users can flag incorrect venues, suspected scams, or safety violations. Reports feed directly into the Admin review queue and penalize trust points.

---

### 🎟️ Module F: QR-Based Attendance Check-In
- **Active Only on Verified Events:** Prevents fraudulent check-ins on unverified or reported listings.
- **Interactive QR Generator:** Generates unique attendance tokens.
- **Multi-Mode Scanner:**
  - Live camera scanner via `html5-qrcode`.
  - Manual token string validation.
  - **1-Click Test Scan Simulator** for instantaneous live project presentations without requiring second devices or physical cameras.
- **Live Attendance Tracker:** Real-time attendee counter with duplicate check-in prevention.

---

### 📊 Module G: Administrator Compliance Dashboard
- **Live KPI Metrics:** Total Users, Total Events, Pending Review, Verified, Reported, Rejected, and Total Check-Ins.
- **Pending Review Queue:** Audit uploaded sanction letters, review component trust scores, and approve with 1 click.
- **Rejection with Reason:** Enforce rejection with mandatory written feedback transmitted to the organizer.
- **Community Complaint Ledger:** Inspect reported listings and dismiss or ban fraudulent submissions.
- **Organizer Credential Management:** Toggle official "Verified Organizer" status (+35 credibility points).

---

### 🌟 Module H: Additional Features
- **Saved Favourites:** Personal bookmarking system.
- **Calendar Integration:** One-click `.ics` calendar export and direct Google Calendar link generation.
- **Live Demo Persona Switcher:** Floating control pill allowing 1-click switching between Student, Organizer, and Admin personas during presentations.
- **Factory Demo Reset:** Reverts all data back to the clean initial 10-event dataset.

---

## 3. Technology Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS (Custom blue, purple, and slate palette with soft shadows)
- **Icons:** Lucide React
- **QR Engine:** `qrcode.react` (SVG generator) & `html5-qrcode` (camera scanner)
- **Mapping:** Leaflet & OpenStreetMap (`leaflet`)
- **Visual Feedback:** `canvas-confetti`
- **Database & Storage Architecture:**
  - **Live Mode:** Firebase Firestore, Firebase Authentication, and Firebase Storage
  - **Zero-Config Demo Mode:** High-fidelity local state engine backed by `localStorage` (runs 100% offline out-of-the-box without requiring external API keys).

---

## 4. Demo Login Credentials

For live evaluation and presentation, the application provides built-in 1-click persona switching or manual login:

| Role | Email | Password | Intended Test Workflows |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@eventsphere.edu` | `admin` | Access Admin Dashboard, review pending submissions, audit letters, grant Verified status, resolve reports. |
| **Event Organizer** | `organizer@eventsphere.edu` | `org` | Submit new events with evidence, test duplicate warnings, inspect attendee scan metrics. |
| **Normal User** | `student@eventsphere.edu` | `user` | Discover events, confirm accuracy (+trust), submit reports, QR check-in pass, bookmark favourites. |

---

## 5. Database Structure (Firestore Collections)

The application models 7 interconnected collections:

```
eventsphere/
├── users/
│   └── {userId}
│       ├── name: string
│       ├── email: string
│       ├── role: 'Normal User' | 'Event Organizer' | 'Administrator'
│       ├── institution: string
│       ├── institutionVerified: boolean
│       ├── isVerifiedOrganizer: boolean
│       └── completedEventsCount: number
│
├── events/
│   └── {eventId}
│       ├── title: string
│       ├── description: string
│       ├── category: string
│       ├── date: string (YYYY-MM-DD)
│       ├── startTime: string (HH:mm)
│       ├── endTime: string (HH:mm)
│       ├── venue: string
│       ├── location: string
│       ├── coordinates: [lat, lng]
│       ├── status: 'Pending Verification' | 'Verified' | 'Reported' | 'Rejected' | 'Completed'
│       ├── organizerId: string
│       ├── organizerName: string
│       ├── qrCodeString: string | null
│       ├── evidence: { hasPoster, hasDocuments, documentName, documentType, bookingProof }
│       ├── confirmations: [{ userId, userName, timestamp, note }]
│       ├── reports: [{ id, userId, category, reason, timestamp }]
│       └── checkIns: [{ userId, userName, scannedAt }]
│
├── confirmations/
│   └── {confId} -> { eventId, userId, timestamp, note }
│
├── reports/
│   └── {reportId} -> { eventId, userId, category, reason, status, timestamp }
│
├── checkins/
│   └── {checkInId} -> { eventId, userId, scannedAt }
│
├── favourites/
│   └── {userId} -> { eventIds: string[] }
│
└── notifications/
    └── {notifId} -> { recipientId, title, message, type, read, createdAt }
```

---

## 6. Installation & Execution Guide

### Prerequisites
- Node.js (v18.0 or newer)
- npm or pnpm or yarn

### Step 1: Navigate to the Project Folder
```bash
cd eventsphere
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Build for Production
```bash
npm run build
npm run preview
```

---

## 7. Connecting Firebase (Live Mode Setup)

To switch from the default **Local Demo Mode** to **Live Firebase Cloud**:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore** and deploy the included `firestore.rules`.
4. Enable **Cloud Storage** for poster and PDF uploads.
5. Create a `.env` file in the `eventsphere` root based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```

6. Restart Vite: `npm run dev`. EventSphere will automatically detect the credentials and switch to live Firebase Firestore!

---

## 8. Verification of Complete Lifecycle (Demonstration Script)

For a live college presentation, follow this verified 10-step lifecycle:

1. **Step 1:** Click the floating **Demo Persona** pill at bottom-left and select **Normal User (Student)**.
2. **Step 2:** Explore the discovery feed, toggle the **Map View** to see interactive OpenStreetMap venue pins.
3. **Step 3:** Switch persona to **Event Organizer (Kavya Sharma)**.
4. **Step 4:** Navigate to **Submit Event**. Fill in a new workshop (e.g. *"Autonomous Drone Navigation Workshop"*). Notice how comprehensive descriptions increase the Detail Consistency score.
5. **Step 5:** Submit the listing. Observe that it enters **`Pending Verification`** status with an initial computed Trust Score.
6. **Step 6:** Switch persona back to **Normal User**. Open the new event and click **Confirm Event Accuracy**. Watch the Community Confirmation score and overall Trust Score increase dynamically!
7. **Step 7:** Switch persona to **Administrator (Dr. Evelyn Vance)**. Navigate to **Admin Portal**.
8. **Step 8:** Inspect the pending submission, click **Audit Evidence** to inspect the attached sanction letter.
9. **Step 9:** Click **Grant Verified Status**. Confetti triggers and the event status changes to **Verified**.
10. **Step 10:** Open the event pass, click **Scan Pass** (or use the simulated attendee check-in scanner). Attendance records update immediately with timestamps!

---

## 9. Academic Project Credits

- **Project:** EventSphere – Community-Based Local Event Discovery and Validation
- **Domain:** Web Engineering, Crowdsourced Trust Systems & Information Security
- **Target Audience:** Engineering College Campus Community & Local Neighborhoods
