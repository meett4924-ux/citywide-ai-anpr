# CityWide ANPR — Part 2 Files Only (Authentication System)

This archive contains **only the files created or modified in Part 2**
(authentication). It mirrors the exact folder paths of the full project, so you
can drop these files directly into your existing `citywide-ai-anpr/` folder,
overwriting the matching paths.

## How to apply
1. Extract this zip.
2. Copy `client/` and `server/` folders on top of your existing project root
   (same relative paths — e.g. `client/src/pages/Login.jsx` overwrites your
   existing `client/src/pages/Login.jsx`).
3. Run `npm install` in both `client/` and `server/` (in case new dependencies
   were referenced — none were added in Part 2, so this is just a safety step).
4. Restart both dev servers.

## Files included

**Backend**
- `server/models/User.js` — organization, role enum, avatar, isActive fields
- `server/controllers/authController.js` — register/login/getMe with full validation
- `server/routes/authRoutes.js` — `POST /api/auth/register` (+ `/signup` alias), `/login`, `/me`
- `server/scripts/createAdmin.js` — dev-safe first-admin bootstrap (`npm run seed:admin`)
- `server/package.json` — adds the `seed:admin` script
- `server/.env.example` — unchanged, included for reference

**Frontend**
- `client/src/context/AuthContext.jsx` — remember-me, silent session restore
- `client/src/context/ToastContext.jsx` — toast notification system
- `client/src/components/ui/ToastViewport.jsx`
- `client/src/components/auth/PasswordStrengthMeter.jsx`
- `client/src/components/layout/ProtectedRoute.jsx` — waits for session check before redirecting
- `client/src/components/layout/PublicOnlyRoute.jsx` — keeps signed-in users off login/signup
- `client/src/components/layout/FullScreenLoader.jsx`
- `client/src/components/layout/UserMenu.jsx` — wired logout + toast
- `client/src/pages/Login.jsx`, `Signup.jsx` — full auth forms with validation
- `client/src/pages/Settings.jsx` — `organization` field (renamed from `department`)
- `client/src/layouts/AuthLayout.jsx` — brand copy update
- `client/src/services/api.js`, `authService.js`, `mockData.js`
- `client/src/utils/session.js`, `validation.js`
- `client/src/App.jsx`, `main.jsx` — route guards + provider wiring
- `client/.env.example` — unchanged, included for reference

## Environment variables (unchanged from Part 1)
**server/.env**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Create the first admin
```bash
cd server
ADMIN_NAME="Admin User" ADMIN_EMAIL="admin@cityanpr.gov" ADMIN_PASSWORD="ChangeMe123!" npm run seed:admin
```
