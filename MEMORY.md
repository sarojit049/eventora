# Eventora Deployment Architecture & Status

## Environment Overviews
- **Frontend**: Vite + React, deploying to Vercel (SPA routing configured via `vercel.json`).
- **Backend**: Node.js + Express, deploying to Render (port dynamically assigned).
- **Database**: MongoDB Atlas.
- **Payments**: Razorpay (Test Mode initially).

## Completed Preparation Steps
- **Project Structure**: Audited the repository and cleaned up temporary diagnostic scripts (e.g., `_test_events.js`, `events.json`).
- **Port Handling**: Backend uses dynamic port handling `process.env.PORT || 5000` via Render environment configuration instead of hardcoded `5001`.
- **Environment Files**: Ensured `.env` files are fully protected via `.gitignore`. Added template `backend/.env.example` and `frontend/.env.example` files. No secret values are tracked.
- **MongoDB Atlas Compatibility**: Added explicit guard in backend configuration to enforce presence of `MONGODB_URI` environment variable when `NODE_ENV=production`. Local fallback remains intact.
- **CORS Handling**: Upgraded CORS to validate `config.cors.origin` (for Vercel) and locally allowed origins dynamically based on `development` mode without wildcards.
- **Frontend API Configured**: Replaced hardcoded localhost URL strings across Axios interceptors with `import.meta.env.VITE_API_URL` to facilitate Vercel's endpoint configuration.
- **Vercel SPA Routing**: Generated `frontend/vercel.json` with a rewrite rule (`source: /(.*)`, `destination: /index.html`) to prevent 404 errors during client-side refresh events.
- **Render Startup Verification**: Verified health endpoint `/health` and confirmed `"start": "node src/server.js"` operates safely. Build tests succeeded.
