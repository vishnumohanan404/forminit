# FormInIt — Claude Context

## Project Overview

FormInIt is a Notion-like form builder where forms are composed of blocks (EditorJS-style). Users
create workspaces, add forms, publish them, and collect submissions.

**Tech Stack**

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, EditorJS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB via Mongoose
- **Auth:** JWT in HTTP-only cookies + Google OAuth
- **Monorepo:** npm workspaces (`client`, `backend`, `packages/types`)
- **Tooling:** Husky + commitlint (Conventional Commits), lint-staged, Prettier, ESLint

---

## Running Locally

```bash
docker compose up --build
```

| Service | Host Port | Container Port |
| ------- | --------- | -------------- |
| client  | 5174      | 5173           |
| backend | 3100      | 3000           |
| mongo   | 27018     | 27017          |

Environment files required:

- `client/.env` — must include `VITE_BACKEND_URL`
- `backend/.env` — must include `JWT_SECRET`, `MONGODB_URI`, `CLIENT_URL`, `PORT`

---

## Monorepo Structure

```
forminit/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── contexts/     # AuthProvider (JWT state in localStorage)
│       ├── layouts/
│       ├── pages/
│       ├── services/     # axios client (withCredentials)
│       └── lib/types.ts  # local type defs (may diverge from packages/types)
├── backend/         # Express API
│   └── src/
│       ├── controllers/
│       ├── middlewares/  # verifyToken (JWT cookie auth)
│       ├── models/       # Mongoose schemas
│       ├── routes/
│       ├── validations/
│       └── index.ts
├── packages/
│   └── types/       # Shared types (@shared/types alias)
├── docker-compose.yml
└── CLAUDE.md        # ← you are here
```

---

## Branching Strategy (Gitflow-lite)

```
main          ← production, protected, tagged releases (vX.Y.Z)
  └── dev     ← integration branch, always working state
        ├── feature/xxx
        ├── fix/xxx
        ├── refactor/xxx
        └── chore/xxx
```

**Rules:**

- All work branches off `dev`
- PRs target `dev` (never directly `main`)
- `main` ← `dev` only via release PR, tagged with semver
- Commit messages: Conventional Commits (enforced by commitlint + husky)
- Branch naming: `feature/`, `fix/`, `chore/`, `refactor/`

**Remotes:**

- `origin` → GitHub (https://github.com/vishnumohanan404/forminit) — source of truth

---

## API Route Surface

All routes are prefixed `/api`.

| Method | Path                      | Auth | Description                               |
| ------ | ------------------------- | ---- | ----------------------------------------- |
| POST   | /auth/signup              | —    | Register new user                         |
| POST   | /auth/login               | —    | Login, sets JWT cookie                    |
| POST   | /auth/google              | —    | Google OAuth                              |
| GET    | /user                     | JWT  | Get current user                          |
| PUT    | /user                     | JWT  | Update user profile                       |
| PUT    | /user/update-password     | JWT  | Change password                           |
| GET    | /dashboard                | JWT  | Get user's dashboard (workspaces + forms) |
| POST   | /workspace                | JWT  | Create workspace                          |
| DELETE | /workspace/:workspaceId   | JWT  | Delete workspace                          |
| POST   | /form                     | JWT  | Create new form                           |
| GET    | /form/:formId             | JWT  | Fetch form (editor view)                  |
| GET    | /form/view-form/:formId   | —    | Public form view                          |
| PUT    | /form/:id                 | JWT  | Update form content                       |
| POST   | /form/submit-form         | —    | Submit a response                         |
| GET    | /form/submissions/:formId | JWT  | Fetch all submissions                     |
| DELETE | /form/:id                 | JWT  | Delete form                               |
| PUT    | /form/disable/:id         | JWT  | Toggle form disabled status               |
| GET    | /changelogs               | —    | Fetch changelogs                          |

---

## DB Models Summary

### User

Fields: `fullName`, `email` (unique), `bio`, `password` (select:false), `avatar`, `googleId` (sparse
unique), timestamps.

### Form

Fields: `title`, `time`, `version`, `blocks[]` (type + data), `workspaceId`, `disabled`, timestamps.
Block data is `Mixed` type — flexible for different EditorJS block types.

### Dashboard

Fields: `user_id` (ref: User), `workspaces[]` — each workspace has `name`, `created`, and nested
`forms[]`. Nested form fields: `name`, `submissions`, `created`, `modified`, `url`, `form_id` (ref:
Form), `disabled`.

### Submission

Fields: `title`, `formId`, `blocks[]` (type + data, same structure as Form blocks), timestamps.

---

## Known Landmines (Fix in Prioritized Sprints)

### Critical

1. `getUserFromContext()` returns `setUser` instead of `user` —
   `client/src/contexts/AuthProvider.tsx:41`
2. `JSON.parse` without try/catch on localStorage — crashes on corrupted data —
   `AuthProvider.tsx:14`
3. `location.replace("/")` on 401 bypasses React Router — full page reload —
   `client/src/services/index.ts:19`

### Security

4. Password complexity rules commented out — `backend/src/validations/user.ts:8`
5. JWT secret falls back to hardcoded string — `backend/src/middlewares/authentication.ts:9`
6. Auth middleware cookie-clearing commented out — `backend/src/middlewares/authentication.ts:42`
7. ShareTab builds URL from `searchParams.get("url")` with no validation —
   `client/src/layouts/form-summary/ShareTab.tsx:10`

### Code Quality

8. Hardcoded `localhost:3000` fallback in axios base URL — `client/src/services/index.ts:4`
9. No React error boundaries anywhere in the component tree
10. Type duplication: `lib/types.ts` vs `packages/types` — can diverge
11. `@ts-ignore` in `swipeable-stack-cards.tsx`
12. Large commented-out filter logic — `client/src/pages/Dashboard.tsx:40-53`
13. `setTimeout(..., 0)` timing hacks in EditorJS tools

---

## Living Doc Practice

Update this file as part of every PR that changes:

- DB models (add/remove fields or collections)
- API routes (new endpoints, changed paths/auth)
- Architecture (new services, auth mechanism changes, new packages)

PR description checklist should include:
`[ ] CLAUDE.md updated if models/routes/architecture changed`
