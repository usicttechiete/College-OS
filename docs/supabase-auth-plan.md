# Supabase Authentication Rollout Plan

## Goal
Establish secure, scalable authentication for College OS using Supabase Auth, ensuring the backend exposes protected APIs and the frontend enforces session-aware routing so unauthenticated users only see the login/signup experience.

---

## Phase 0 – Pre-flight Alignment
**Objectives**
- Confirm architectural decisions, compliance requirements, and team ownership before touching Supabase resources.

**Key Tasks**
1. **Stakeholder alignment** – Document auth flows (email/password + optional OTP), password policies, and recovery requirements in a shared RFC.
2. **Access & billing setup** – Grant backend engineers Supabase project access, configure billing alerts, and store service role credentials in the secrets manager (e.g., Doppler/Azure Key Vault).
3. **Environment matrix** – Finalize environments (`local`, `dev`, `staging`, `prod`) and map each to a Supabase project or schema; decide on seed data strategy for non-prod.
4. **Security baseline** – Agree on password complexity, session lifetime, MFA roadmap, and audit logging expectations aligned with campus policies.

**Deliverables**
- Auth RFC with approved requirements.
- Access control list for Supabase console + CLI.
- Environment and secrets management checklist.

---

## Phase 1 – Supabase Project & Backend Setup
**Objective**: Provision Supabase resources and connect them to the backend service without yet exposing auth flows.

**Key Tasks**
1. **Create Supabase project(s)** – Use Supabase dashboard/CLI to provision dev and staging projects; note project reference IDs.
2. **Install Supabase tooling** – Add `@supabase/supabase-js` (service role variant) to backend, install Supabase CLI for local emulation.
3. **Configure environment variables** – Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` to backend `.env` files; wire them into configuration loader.
4. **Database schema preparation** – Define `profiles` table mirroring PRD user model fields (enrollment, batch, branch, role, trustScore) using Supabase SQL migrations.
5. **RLS & policies groundwork** – Enable Row Level Security on user-related tables with placeholder policies (allow auth uid match) to be refined in Phase 2.
6. **Local development loop** – Document steps to run Supabase locally (`supabase start`), seed test accounts, and connect backend Express server to local instance.

**Acceptance Criteria**
- Backend can successfully connect to Supabase, run a health check, and read seed data using service role key.
- Migrations are version-controlled (`/backend/db/migrations`) and reproducible via CLI.
- RLS is enabled on all auth-sensitive tables.

---

## Phase 2 – Backend Authentication Integration
**Objective**: Implement Supabase Auth flows and expose backend endpoints that rely on authenticated sessions.

**Key Tasks**
1. **Auth configuration** – Enable email/password provider, set up SMTP (Supabase Auth > Providers) with institutional domain, and configure email templates.
2. **Backend SDK wrapper** – Build a Supabase client module that handles service role usage, typed responses, and error normalization.
3. **User lifecycle hooks** – Implement database triggers or edge functions to sync Supabase `auth.users` with `profiles` table on sign-up/update.
4. **API endpoint hardening** – Replace mock auth middleware with Supabase JWT validation (verifying `Authorization: Bearer` tokens); enforce role-based access where needed.
5. **Session management** – Define refresh token handling strategy (Supabase auto-refresh vs backend proxy), and set cookie policies for future SSR use.
6. **Testing & tooling** – Write integration tests (e.g., using `supertest`) covering signup/login flows, protected routes, and RLS enforcement; add CLI scripts to create test users.

**Acceptance Criteria**
- `/auth/signup` and `/auth/login` routes proxy to Supabase Auth and return standardized responses.
- Protected backend routes reject requests without valid Supabase JWT.
- `profiles` table stays consistent with Supabase auth user metadata.

**Deliverables**
- Updated API docs for auth endpoints.
- Postman/Insomnia collection demonstrating authenticated requests.

---

## Phase 3 – Frontend Integration & Persistent Sessions
**Objective**: Replace mocked auth context with Supabase-powered session management, enforce routing guards, and deliver persistent UX.

**Key Tasks**
1. **Supabase client setup** – Install `@supabase/supabase-js` in frontend, create a singleton client (`supabaseClient.ts`) configured with anon key and environment switching.
2. **AuthContext refactor** – Swap mocked context with Supabase session listener (`supabase.auth.onAuthStateChange`), store session in state, and expose signin/signup/logout methods calling backend APIs.
3. **Persistent storage** – Leverage Supabase’s auto-refresh; ensure session persists via `supabase.auth.getSession()` on app boot, and handle token refresh errors with silent re-auth prompts.
4. **Routing enforcement** – Introduce protected route component or layout wrapper that redirects guests to `/login`; ensure `/login` and `/signup` redirect authenticated users to `/home`.
5. **UI states & errors** – Implement loading spinners during session restoration, surface auth errors inline, and add toasts for logout/expiry events.
6. **Cross-origin and cookie setup** – Configure backend CORS to allow frontend origin, set secure cookies if using server proxy, and verify same-site policies in each environment.

**Acceptance Criteria**
- Refreshing the app maintains session state without re-login (for valid tokens).
- Guests cannot access `/home`, `/found`, `/messages`, `/account`; they are redirected to auth screens.
- Authenticated users bypass `/login`/`/signup` automatically.

**Deliverables**
- Frontend README updates describing auth flows and environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Cypress/E2E scripts covering login redirect behavior and session persistence.

---

## Phase 4 – QA, Security Review & Rollout
**Objective**: Validate end-to-end behavior, security posture, and operational readiness before production launch.

**Key Tasks**
1. **Comprehensive QA** – Run manual regression and automated tests across browsers/devices; verify email templates and edge cases (bad password, locked account, expired link).
2. **Security audit** – Perform dependency scan, validate RLS policies via Supabase policy checks, and confirm JWT/refresh token TTLs meet policy.
3. **Monitoring & analytics** – Integrate logging (e.g., Supabase Logs + backend observability) for auth events; set alerts for failed login spikes and suspicious activity.
4. **Documentation & runbooks** – Publish onboarding guide for support staff, incident response steps for account compromise, and SLA expectations.
5. **Launch checklist** – Final go/no-go review covering environments, rollback plan, and communication to stakeholders.

**Acceptance Criteria**
- QA sign-off document with test results and bug closure.
- Security review approved with no critical findings.
- Monitoring dashboards and alerts validated in staging.

---

## Post-Launch Enhancements (Backlog)
1. Add MFA support using Supabase OTP or WebAuthn.
2. Implement social login if future requirements demand.
3. Automate trust score updates based on activity events.
4. Evaluate Supabase Edge Functions for advanced auth workflows (e.g., conditional email approval).
5. Periodically review auth metrics and iterate on UX friction.

---

## Dependencies & Ownership
- **Backend Lead** – Owns Supabase project configuration, migrations, and secure backend integration.
- **Frontend Lead** – Owns AuthContext refactor, routing guards, and UX refinements.
- **DevOps/SRE** – Manages secrets, monitoring, and environment parity.
- **QA** – Builds test plans and automation coverage for auth flows.

## Timeline Guidance
- Phase 0: 2–3 days
- Phase 1: 3–4 days (including infrastructure approvals)
- Phase 2: 5–6 days with testing
- Phase 3: 5 days including UX polish
- Phase 4: 3 days end-to-end validation

Adjust timeline based on team capacity and dependencies (e.g., SMTP provider readiness).

---

## Implementation Status

### ✅ Phase 1 – Supabase Project & Backend Setup
- [x] Installed `@supabase/supabase-js` in backend
- [x] Created environment configuration (`src/config/env.js`, `.env.example`)
- [x] Built Supabase client module (`src/lib/supabase.js`) with admin and user clients
- [x] Created `profiles` table migration with RLS policies (`db/migrations/001_create_profiles_table.sql`)
- [x] Added database trigger for auto-creating profiles on signup

### ✅ Phase 2 – Backend Authentication Integration
- [x] Created auth middleware (`src/middleware/auth.js`) with JWT validation
- [x] Implemented auth routes (`src/routes/auth.js`):
  - POST `/auth/signup` - User registration
  - POST `/auth/login` - Email/password login
  - POST `/auth/logout` - Sign out
  - POST `/auth/refresh` - Token refresh
  - GET `/auth/me` - Get current user profile
  - PATCH `/auth/profile` - Update profile
  - POST `/auth/forgot-password` - Password reset
- [x] Added role-based authorization middleware
- [x] Created Express server entry point (`src/index.js`)

### ✅ Phase 3 – Frontend Integration & Persistent Sessions
- [x] Installed `@supabase/supabase-js` in frontend
- [x] Created Supabase client (`src/lib/supabase.ts`)
- [x] Built API client (`src/lib/api.ts`) for backend communication
- [x] Refactored `AuthContext` with:
  - Supabase session listener
  - Persistent session restoration
  - Real login/signup/logout methods
- [x] Created `ProtectedRoute` component for authenticated routes
- [x] Created `GuestRoute` component for auth pages
- [x] Updated `App.tsx` with route guards
- [x] Wired `LoginPage` and `SignupPage` to auth context

### ⏳ Phase 4 – QA, Security Review & Rollout
- [ ] Run migrations in Supabase SQL editor
- [ ] Configure Supabase email templates
- [ ] Test end-to-end auth flows
- [ ] Security audit and RLS policy verification
