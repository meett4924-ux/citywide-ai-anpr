# CityWide ANPR — City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking and Urban Traffic Analytics

**Team:** TEAM ARCEUS

## 1. Project Overview

CityWide ANPR is a MERN-stack smart-city traffic intelligence platform prototype
for a police/traffic command center: ANPR (Automatic Number Plate Recognition)
processing, multi-camera vehicle tracking, cross-camera trajectory reconstruction,
traffic analytics, and a flagged-vehicle alerting workflow — all demonstrable
without any physical camera hardware, live camera API, or mandatory database
connection.

**Status:**
- **Part 1** — Application shell, routing, layout, all primary screens. ✅
- **Part 2** — Full authentication (JWT + bcrypt), protected routes, logout. ✅
- **Part 3** — ANPR upload/processing pipeline (demo provider), history, dashboard stats. ✅
- **Part 4 (final)** — Multi-camera tracking, cross-camera journeys, live map trajectories,
  traffic analytics, congestion heuristic, vehicle flagging/alerts, and a one-click
  **Demo Scenario** that ties the whole pipeline together for presentation. ✅

## 2. Technology Stack

**Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Axios, Lucide React, Recharts, React Leaflet
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, dotenv, cors, morgan

## 3. Folder Structure

```
citywide-ai-anpr/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── anpr/        # Upload, processing steps, result cards, history table
│   │   │   ├── demo/        # DemoScenarioPanel (Start/Stop/Reset orchestration)
│   │   │   ├── dashboard/   # Stat cards, charts, ANPR stats
│   │   │   ├── layout/      # Sidebar, Topbar, route guards
│   │   │   ├── map/         # CameraMap (Leaflet, trajectory overlay)
│   │   │   └── ui/          # Card, Badge, ListToolbar, ToastViewport...
│   │   ├── context/         # Auth, UI, Toast, DemoScenario
│   │   ├── pages/           # Dashboard, ANPR, Cameras, Trajectories, TrafficAnalytics, Alerts, Map, ...
│   │   ├── services/        # api.js + one service module per resource
│   │   └── utils/
│   ├── package.json / .env.example / vite config / tailwind config
│
├── server/
│   ├── config/db.js
│   ├── controllers/         # auth, anpr, camera, tracking, analytics, alert
│   ├── data/demoCameras.js  # Shared demo camera dataset (7 cameras)
│   ├── middleware/          # auth (protect / optionalAuth), upload, error handling
│   ├── models/              # User, Camera, Detection, Alert
│   ├── routes/              # auth, anpr, cameras, tracking, analytics, alerts
│   ├── services/
│   │   ├── anpr/            # demoProvider, plateValidator, pipeline, detectionStore
│   │   ├── alerts/alertStore.js
│   │   └── tracking/        # journeyBuilder, demoJourneySimulator
│   ├── scripts/createAdmin.js
│   ├── server.js / package.json / .env.example
│
└── README.md / .gitignore
```

## 4. Prerequisites
Node.js v18+, npm. MongoDB is **optional** (see Demo Mode below).

## 5. Environment Variables

**server/.env** (copy from `.env.example`)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/anpr_platform   # optional — see Demo Mode
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
ANPR_MAX_UPLOAD_MB=50
```

**client/.env** (copy from `.env.example`)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAP_DEFAULT_LAT=23.2156
VITE_MAP_DEFAULT_LNG=72.6369
VITE_MAP_DEFAULT_ZOOM=12
```

## 6. Install & Run

```bash
# Backend
cd server
npm install
npm run dev        # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev         # http://localhost:5173
```

### Create the first admin (only needed if you're using MongoDB for login)
```bash
cd server
ADMIN_NAME="Admin User" ADMIN_EMAIL="admin@cityanpr.gov" ADMIN_PASSWORD="ChangeMe123!" npm run seed:admin
```

## 7. Demo Mode — No MongoDB Required

The ANPR, camera, tracking, analytics, and alerts modules (`/api/anpr/*`,
`/api/cameras`, `/api/tracking`, `/api/analytics`, `/api/alerts`) all work with
**zero MongoDB connection** — they transparently fall back to an in-process
in-memory store (`server/services/anpr/detectionStore.js`,
`server/services/alerts/alertStore.js`) whenever `mongoose.connection.readyState`
isn't `1`. Nothing is deleted from the MongoDB architecture — whenever a real
`MONGO_URI` is reachable, these same functions transparently use MongoDB instead.

These routes also use `optionalAuth` rather than `protect`, so they don't
require a login token either — this specifically unblocks testing/demo when
MongoDB (and therefore login, which does require MongoDB) is unavailable.

> Note: the frontend **login page itself** still requires MongoDB (credentials
> must be checked against the `User` collection). If you want to click through
> the full browser UI, you need a reachable MongoDB at least for the login step.

## 8. The Demo Scenario (Part 4 capstone)

On the **Dashboard**, the "Demo Scenario" panel runs the entire pipeline with
one click, using only the real existing APIs (no special-cased backend logic):

1. **Start Demo Scenario** — uploads a tiny bundled demo image through the real
   `POST /api/anpr/process` endpoint. The backend's existing demo ANPR pipeline
   detects a vehicle and (Part 4) assigns it to a random demo camera, then
   fabricates 1-3 additional **simulated** sightings of the same plate at other
   demo cameras a few minutes apart — this is what makes a *single* upload
   demonstrate *cross-camera* tracking. It then fetches that vehicle's journey
   (`GET /api/tracking/:plate`), refreshes analytics (`GET /api/analytics`),
   and flags the vehicle (`POST /api/alerts/flag`) — narrating each step live.
2. **Stop** — cancels the sequence after the current in-flight step.
3. **Reset Demo Data** — deletes every detection record the demo run created
   (`DELETE /api/anpr/:id`, using IDs returned from the process call) and
   acknowledges the demo alert (`PATCH /api/alerts/:id/acknowledge`). It only
   touches records created by that specific run — never unrelated data.
4. Result links jump straight to **Trajectories**, **Live Map**, **Traffic
   Analytics**, and **Alerts** with the demo vehicle's plate pre-filled via a
   `?plate=` URL parameter, so the presenter can show the same vehicle's story
   across every page.

Every simulated/demo value is labeled as such in the UI (badges, notices, and
a `*` marker on simulated camera hops in the trajectory table) — none of it is
presented as a real AI detection.

## 9. Available Routes (frontend)

`/login`, `/signup` (public only) · `/dashboard`, `/anpr`, `/cameras`,
`/vehicles`, `/trajectories`, `/traffic-analytics`, `/alerts`, `/map`,
`/reports`, `/settings` (all protected — require login)

## 10. Backend API Summary

- `POST /api/auth/register` (+ `/signup` alias), `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/anpr/process`, `GET /api/anpr`, `GET /api/anpr/:id`, `GET /api/anpr/plate/:plate`, `DELETE /api/anpr/:id`, `GET /api/anpr/stats`
- `GET /api/cameras`, `GET /api/cameras/:cameraId`
- `GET /api/tracking`, `GET /api/tracking/:plateNumber`
- `GET /api/analytics`
- `GET /api/alerts`, `POST /api/alerts/flag`, `PATCH /api/alerts/:id/acknowledge`

## 11. Known Limitations

- ANPR detection/OCR is a labeled DEMO/MOCK provider — no real computer vision model is connected (integration point: `server/services/anprService.js` / `server/services/anpr/pipeline.js`).
- Cross-camera "association" trusts the plate string; it is not a real re-identification system.
- The in-memory fallback store is process-local and cleared on server restart.
- Congestion levels are a simple threshold heuristic, not a real traffic measurement.
- Login still requires MongoDB even though every other module works without it.
