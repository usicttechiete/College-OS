# College Lost & Found Frontend

Progressive web app front-end for the college lost & found platform described in `docs/prd.md`. Built with React, Vite, TypeScript, and Tailwind CSS (v4).

## Getting started

```bash
npm install
npm run dev
```

## Architecture overview

- **Layouts**: `AppLayout` wraps authenticated pages with top/bottom navigation chrome; `AuthLayout` provides a glassmorphic card for login/signup.
- **Navigation**: Routes defined in `src/App.tsx` cover home, found, forms, messages, account, and auth screens with a 404 fallback.
- **State**: `AuthContext` supplies a mocked logged-in user. Swap with real authentication once APIs are ready.
- **Design system**: Global design tokens live in `src/index.css`. Reusable UI primitives reside in `src/components/ui` (buttons, inputs, selects, textarea).
- **Data mocks**: Static collections under `src/data` (`foundItems.ts`, `lostItems.ts`, `messages.ts`) align with PRD models for quick backend integration later.

## Implemented screens

- Login & signup flows
- Home with warning banner, CTAs, statistics, and recent success highlights
- Found items listing with filters (time, category, place) and item cards
- Found & lost submission forms
- Messages inbox mock with latest threads
- Account page summarizing trust score, activity, and preferences stub

## Next integration steps

1. Replace mock data with API services (auth, found, lost, messages) once backend endpoints are exposed.
2. Wire messaging page to real-time Socket.io client and build message thread view.
3. Extend account theme toggle after dark mode palette is defined.
4. Add detailed item view + claim verification once claim workflow APIs exist.
