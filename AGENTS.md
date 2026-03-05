# AGENTS.md

## Cursor Cloud specific instructions

### Overview

LumiScape is a full-stack Energy Management System: React 19 (Vite) frontend at project root, Express.js backend in `backend/`. Both use npm as the package manager. See `README.md` for full setup instructions and API endpoints.

### Services

| Service | Directory | Port | Start Command |
|---------|-----------|------|---------------|
| Frontend (Vite) | `/workspace` | 5173 | `npm run dev` |
| Backend (Express) | `/workspace/backend` | 5000 | `npm run dev` |
| MongoDB | system service | 27017 | `sudo -u mongodb mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork` |

### Running services

1. **Start MongoDB first** (required by backend):
   ```
   sudo -u mongodb mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork
   ```
2. **Start backend** (from `backend/`): `npm run dev`
3. **Start frontend** (from root): `npm run dev`

### Non-obvious caveats

- **Frontend `npm install` requires `--legacy-peer-deps`** due to `react-image-upload@3.0.1` requiring React 18 peer while the project uses React 19. Always run `npm install --legacy-peer-deps` in the root directory.
- **Stripe API key required for backend startup.** The backend will crash on import if `STRIPE_SECRET_KEY` env var is empty/unset. A placeholder value like `sk_test_placeholder_key_for_development` in `backend/.env` is sufficient to start the server (Stripe payment flows will fail but the rest of the app works).
- **`vite build` has a pre-existing error** referencing a missing `./dashboardScreens/Tariff/index.jsx` file. The dev server (HMR) still works fine.
- **Lint**: `npm run lint` (from root) runs ESLint across the entire project. Pre-existing lint errors exist in the backend code (e.g., `process` not defined in Node.js files).
- **Default admin account**: Register via API: `POST /api/auth/register` with `{"name":"Admin User","email":"admin@lumiscape.com","password":"password123","role":"super-admin"}`. Alternatively, run `node create-admin-user.js` from the root (uses `admin123` as password).
- **Environment files** are not committed. Backend needs `backend/.env` (see README for variables), frontend needs `.env` with `VITE_API_URL=http://localhost:5000/api`.
- MongoDB must be installed as a system dependency (not included in npm deps). It runs on the default port 27017.
