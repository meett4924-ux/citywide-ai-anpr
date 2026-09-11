# CityWide ANPR — City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking and Urban Traffic Analytics

## 1. Project Overview

CityWide ANPR is a MERN-stack smart-city traffic intelligence platform designed for
a professional government / police traffic command center. It provides a single
console for monitoring ANPR (Automatic Number Plate Recognition) cameras, tracking
detected vehicles, reconstructing multi-camera trajectories, analyzing city-wide
traffic patterns, and managing alerts — with a clean, light/white UI suitable for
a public-sector operations environment.

This is **Part 1** of the project: the application shell, authentication flow,
routing, layout system, and all primary screens are complete and working with
realistic mock data. The architecture is intentionally structured so a real
ANPR/computer-vision engine, live camera feeds, and a production database can be
connected in later phases without reworking the frontend or backend structure.

## 2. Technology Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios
- Lucide React (icons)
- Recharts (analytics charts)
- React Leaflet / Leaflet (maps)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs (password hashing)
- dotenv, cors, morgan

## 3. Folder Structure

```
citywide-ai-anpr/
│
├── client/                        # React + Vite frontend
│   ├── public/                    # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── assets/                # Images/static assets used within components
│   │   ├── components/
│   │   │   ├── layout/            # Sidebar, Topbar, PageHeader, menus, ProtectedRoute
│   │   │   ├── ui/                # Reusable UI primitives (Card, Badge, ListToolbar...)
│   │   │   ├── dashboard/         # Dashboard-specific widgets and charts
│   │   │   └── map/                # CameraMap (React Leaflet)
│   │   ├── context/                # AuthContext, UIContext
│   │   ├── hooks/                  # useBreadcrumb, useClickOutside
│   │   ├── layouts/                # AuthLayout, DashboardLayout
│   │   ├── pages/                  # One file per route (Dashboard, Cameras, Vehicles...)
│   │   ├── services/                # api.js (axios), authService.js, mockData.js
│   │   ├── utils/                   # formatters.js
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind layers + design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                        # Express + MongoDB backend
│   ├── config/                    # db.js (MongoDB connection)
│   ├── controllers/               # authController.js
│   ├── middleware/                # authMiddleware.js, errorMiddleware.js
│   ├── models/                    # User, Camera, Detection, Alert (Mongoose schemas)
│   ├── routes/                    # index.js, authRoutes.js
│   ├── services/                  # anprService.js (integration point for future AI engine)
│   ├── utils/                     # generateToken.js, asyncHandler.js
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

## 4. Prerequisites

Before running this project, make sure you have installed:

- **Node.js** v18 or later (v20+ recommended) — [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node.js)
- **MongoDB** — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally, or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (cloud-hosted)
- A code editor such as VS Code (optional, but recommended)

## 5. MongoDB Setup

**Option A — Local MongoDB (Windows):**
1. Install MongoDB Community Server and start the `MongoDB` service (it usually
   starts automatically and listens on `mongodb://127.0.0.1:27017`).
2. No manual database creation is needed — Mongoose will create the
   `anpr_platform` database automatically the first time data is written.

**Option B — MongoDB Atlas (cloud):**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP address (or `0.0.0.0/0` for local testing).
3. Copy the provided connection string — it will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/anpr_platform`

Either way, you will paste the connection string into `server/.env` as `MONGO_URI`
(see next section).

## 6. Environment Variable Setup

Both `client` and `server` include a `.env.example` file. Copy each one to `.env`
and fill in your own values — **never commit `.env` files**.

**server/.env**
```
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/anpr_platform

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api

VITE_MAP_DEFAULT_LAT=23.2156
VITE_MAP_DEFAULT_LNG=72.6369
VITE_MAP_DEFAULT_ZOOM=12
```

On Windows (Command Prompt or PowerShell), you can copy the example files with:
```
copy server\.env.example server\.env
copy client\.env.example client\.env
```

## 7. Backend Installation

```bash
cd server
npm install
```

## 8. Frontend Installation

```bash
cd client
npm install
```

## 9. How to Start the Project

Open **two terminal windows** — one for the backend, one for the frontend.

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
The API will start on `http://localhost:5000` (health check: `GET /api/status`).

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
The app will start on `http://localhost:5173`.

Open `http://localhost:5173` in your browser. You'll be redirected to `/login`.

> **Note:** Login/signup will show a connection error until a MongoDB instance is
> reachable via `MONGO_URI` — this is expected in this phase, since the auth
> endpoints are wired to a real database (not mocked). All other pages
> (Dashboard, Cameras, Vehicles, etc.) render fully with mock data regardless of
> backend/database status, so the full UI can be reviewed immediately.

## 10. Available Routes

| Route                | Description                                   |
|-----------------------|-----------------------------------------------|
| `/login`              | Sign in                                       |
| `/signup`             | Request platform access                       |
| `/dashboard`          | Operations overview (KPIs, charts, alerts)    |
| `/cameras`            | Camera network status and management          |
| `/vehicles`           | Recent ANPR vehicle detections                |
| `/trajectories`       | Reconstructed multi-camera vehicle routes     |
| `/traffic-analytics`  | City-wide traffic flow analytics              |
| `/alerts`             | Critical/warning/info alert feed              |
| `/map`                | Live map of camera locations                  |
| `/reports`            | Generated report history                      |
| `/settings`           | Profile, notification, and security settings  |

All routes except `/login` and `/signup` are protected and require authentication.

## 11. Current Features (Part 1)

- Full application shell: responsive sidebar, top navigation, breadcrumb/page titles
- Collapsible desktop sidebar and mobile drawer navigation
- User profile menu and notifications dropdown
- JWT-based authentication context, login and signup forms wired to the backend API
- Protected routing (unauthenticated users are redirected to `/login`)
- All 9 core screens implemented with a professional light/white UI and realistic
  mock data (cameras, vehicles, trajectories, alerts, analytics, reports)
- Interactive charts (traffic volume, detections by camera, vehicle class split)
  using Recharts
- Interactive camera map using React Leaflet
- Express + MongoDB backend with working `signup` / `login` / `me` endpoints,
  password hashing, and JWT issuance
- Clean separation between UI and data layer (`services/mockData.js`) so screens
  can be switched from mock data to live API calls without markup changes

## 12. Future Features (Planned — Not Yet Implemented)

- Real ANPR/computer-vision engine integration (`server/services/anprService.js`
  is the designated integration point)
- Live camera stream ingestion (RTSP/HTTP feeds)
- Real-time vehicle detection pipeline and plate-matching against hotlists
- Persisted cameras, vehicles, trajectories, and alerts in MongoDB (currently
  modeled via Mongoose schemas but not yet populated by real data)
- Role-based access control (admin / operator / viewer)
- Live notifications (WebSocket/SSE) instead of static mock notifications
- Report generation and export (PDF/CSV)
- Search and advanced filtering across vehicles, trajectories, and alerts

## 13. Notes for Developers

- `client/src/services/mockData.js` centralizes all mock data. As backend
  endpoints become available, replace calls to this file with calls through
  `client/src/services/api.js` — component markup does not need to change since
  data shapes already mirror the expected API responses.
- No real credentials, API keys, or camera streams are included anywhere in this
  project. All secrets must be supplied via your own `.env` files.
