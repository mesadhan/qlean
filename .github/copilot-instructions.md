# Copilot Instructions for QLean

## Project Overview
- **QLean** is a mobile-responsive Progressive Web App (PWA) for reading the Quran, built with Node.js, Express, TypeScript, Bootstrap 5, and Vitest.
- The app supports offline usage, search (Arabic & Bangla), bookmarks, and Bangla translation.
- Backend API serves Surah data and search; frontend is rendered with EJS templates and Bootstrap.

## Key Architecture & Structure
- **Backend**: `src/server/` (Express app, API routes, services, types)
  - `index.ts`: Main server entry point
  - `routes/`: API endpoints (e.g., `surahRoutes.ts`, `viewRoutes.ts`)
  - `services/`: Data helpers and Quran API logic
  - `shura/`: Text files for each Surah (used by backend)
  - `types/`: TypeScript type definitions
- **Frontend**: `src/public/` and `src/views/`
  - `public/`: Static assets, icons, manifest, sample data
  - `views/`: EJS templates for all pages and partials
- **Tests**: `src/tests/` (Vitest)
- **Config**: `pm2.config.js` (PM2), `tsconfig.json`, `vitest.config.ts`

## Developer Workflows
- **Development**: `npm run dev` (starts server with hot reload)
- **Testing**: `npm test` or `npm run test:coverage` (Vitest)
- **Build**: `npm run build` (TypeScript build)
- **Production**: Use PM2 scripts (`npm run pm2:start`, `pm2 monit`, etc.)
- **Environment**: Copy `.env.example` to `.env` and configure as needed

## Project-Specific Patterns
- **Surah Data**: Each Surah is a `.txt` file in `src/server/shura/`, loaded by backend services
- **API Routing**: All API endpoints are defined in `src/server/routes/`
- **Views**: EJS templates in `src/views/` use partials for layout and scripts
- **Testing**: All tests are colocated in `src/tests/` and use Vitest
- **PWA**: Service Worker and manifest in `src/public/` enable offline support

## Integration & Dependencies
- **External**: Uses PM2 for process management, Bootstrap for UI, Vitest for testing
- **No database**: All Quran data is file-based (see `shura/`)
- **No ORM**: Data access is via file reads, not SQL/ORM

## Examples
- To add a new Surah: place a new `.txt` in `src/server/shura/` and update routes/services if needed
- To add a new API route: create a file in `src/server/routes/` and register it in `index.ts`
- To add a new view: create an EJS file in `src/views/` and link it in the navbar partial

## References
- See `README.md` for full setup, scripts, and deployment details
- Key files: `src/server/index.ts`, `src/server/routes/`, `src/views/`, `pm2.config.js`

---
For questions about conventions or structure, check the README or ask the project maintainer.
