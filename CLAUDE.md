# Lumiform — Claude Context

## Project Overview

Lumiform is a Notion-like form builder where forms are composed of blocks (EditorJS-style). Users
create workspaces, add forms, publish them, and collect submissions.

**Tech Stack**

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, custom block editor (cmdk +
  @dnd-kit)
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
lumiform/
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

- `origin` → GitHub (https://github.com/vishnumohanan404/lumiform) — source of truth

---

## API Route Surface

All routes are prefixed `/api`.

| Method | Path                      | Auth | Description                                                 |
| ------ | ------------------------- | ---- | ----------------------------------------------------------- |
| GET    | /health                   | —    | Liveness check for container orchestration                  |
| POST   | /auth/signup              | —    | Register new user                                           |
| POST   | /auth/login               | —    | Login, sets JWT cookie                                      |
| POST   | /auth/google              | —    | Google OAuth                                                |
| GET    | /user                     | JWT  | Get current user                                            |
| PUT    | /user                     | JWT  | Update user profile                                         |
| PUT    | /user/update-password     | JWT  | Change password                                             |
| GET    | /dashboard                | JWT  | Get user's dashboard (workspaces + forms)                   |
| POST   | /workspace                | JWT  | Create workspace                                            |
| DELETE | /workspace/:workspaceId   | JWT  | Delete workspace                                            |
| POST   | /form                     | JWT  | Create new form                                             |
| GET    | /form/:formId             | JWT  | Fetch form (editor view)                                    |
| GET    | /form/view-form/:formId   | —    | Public form view                                            |
| PUT    | /form/:id                 | JWT  | Update form content                                         |
| POST   | /form/submit-form         | —    | Submit a response                                           |
| GET    | /form/submissions/:formId | JWT  | Fetch all submissions                                       |
| DELETE | /form/:id                 | JWT  | Delete form                                                 |
| PUT    | /form/disable/:id         | JWT  | Toggle form disabled status                                 |
| GET    | /form/analytics/:formId   | JWT  | Aggregated analytics — totals, trends, per-block breakdowns |

---

## DB Models Summary

### User

Fields: `fullName`, `email` (unique), `bio`, `password` (select:false), `avatar`, `googleId` (sparse
unique), timestamps.

### Form

Fields: `title`, `blocks[]` (type + data), `workspaceId`, `disabled`, timestamps. `time` and
`version` are optional legacy EditorJS fields — no longer written by the editor. Block schema: `_id`
(String — UUID, from custom editor), `type` (String), `data` (Mixed). Block data is `Mixed` type —
flexible across all block types.

### Dashboard

Fields: `user_id` (ref: User), `workspaces[]` — each workspace has `name`, `created`, and nested
`forms[]`. Nested form fields: `name`, `submissions`, `created`, `modified`, `url`, `form_id` (ref:
Form), `disabled`.

### Submission

Fields: `title`, `formId`, `blocks[]` (type + data, same structure as Form blocks), timestamps.

---

## Custom Block Editor

EditorJS was replaced with a custom Tally.so-style block editor (Sprint 8a, 2026-03-20).

**Architecture:**

- `BlockEditor.tsx` — state owner, holds `blocks[]`, DnD context, focus registry
- `BlockItem.tsx` — per-block wrapper with drag handle and delete button
- `BlockInsertMenu.tsx` — cmdk-based `/` command palette
- `blocks/` — one component per block type: `ParagraphBlock`, `HeadingBlock`, `ShortAnswerBlock`,
  `LongAnswerBlock`, `MultipleChoiceBlock`, `DropdownBlock`, `EmailBlock`, `DateBlock`,
  `RatingBlock`

**Block types:** `paragraph`, `heading`, `shortAnswerTool`, `longAnswerTool`, `multipleChoiceTool`,
`dropdownTool`, `emailTool`, `dateTool`, `ratingTool`

**Tally-style pairing:** Input blocks have no embedded title. On submission, `getTitleForBlock()` in
`FormView.tsx` walks backwards from each input block to find the nearest preceding
`paragraph`/`heading` as its label.

**Legacy migration:** `normalizeBlocks()` in `BlockEditor.tsx` lazily converts old `questionTitle`
blocks → `paragraph` and splits monolithic input blocks (with embedded `title`) into `paragraph` +
input on load — no DB writes.

**Packages added:** `cmdk`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`,
`@dnd-kit/modifiers` **Packages removed:** all `@editorjs/*`, `editorjs-inline-tool`,
`editorjs-layout`, `title-editorjs`

---

## Known Landmines

All 13 items from the original backlog were resolved across three fix sprints (merged to `dev`,
released in `v0.13.0`). No open landmines as of 2026-03-20.

---

## Living Doc Practice

Update this file as part of every PR that changes:

- DB models (add/remove fields or collections)
- API routes (new endpoints, changed paths/auth)
- Architecture (new services, auth mechanism changes, new packages)

PR description checklist should include:
`[ ] CLAUDE.md updated if models/routes/architecture changed`
