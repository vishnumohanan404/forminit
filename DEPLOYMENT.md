# Lumiform — Deployment Guide

## Stack

| Layer             | Platform                | Branch                                     |
| ----------------- | ----------------------- | ------------------------------------------ |
| Frontend          | Cloudflare Pages        | `dev` → staging, `main` → prod             |
| Backend           | Render (Docker)         | `dev` → staging, `main` → prod             |
| Database          | MongoDB Atlas (M0 free) | Two separate projects                      |
| Error tracking    | Sentry                  | One project, `environment` tag per service |
| Uptime monitoring | UptimeRobot             | Two monitors (staging + prod)              |

---

## Step 1 — MongoDB Atlas

> Atlas allows only one free (M0) cluster per project — create two separate projects.

1. Go to https://cloud.mongodb.com and sign in / create account
2. Create two **projects**: `lumiform-staging` and `lumiform-prod`
   - New project → name it → skip member invite → Create Project → repeat
3. Inside each project, create a **free cluster (M0)**
   - Build a Database → M0 Free → Provider: AWS → Region: closest to your users → Name matches
     project → Create
4. **Database access** — create a DB user in each project
   - Security → Database Access → Add New Database User
   - Auth method: Password → autogenerate password → copy it
   - Role: **Custom** → `readWrite` on database `lumiform` (avoid Atlas Admin — limits blast radius
     if credentials leak)

   | Project            | Username           | Database   |
   | ------------------ | ------------------ | ---------- |
   | `lumiform-staging` | `lumiform-staging` | `lumiform` |
   | `lumiform-prod`    | `lumiform-prod`    | `lumiform` |

5. **Network access** — allow all IPs in both projects (Render uses dynamic IPs)
   - Security → Network Access → Add IP Address → Allow Access From Anywhere (`0.0.0.0/0`) → Confirm
   - Trade-off: unavoidable on free/starter Render. To restrict, enable Render's static outbound IPs
     add-on (~$3/mo) and whitelist those instead.
6. Get the connection strings from each project
   - Database → Connect → Drivers → Node.js → copy the `mongodb+srv://` URI
   - Replace `<password>` and append the DB name before `?`:
     - Staging:
       `mongodb+srv://lumiform-staging:<password>@lumiform-staging.xxxxx.mongodb.net/lumiform?retryWrites=true&w=majority`
     - Prod:
       `mongodb+srv://lumiform-prod:<password>@lumiform-prod.xxxxx.mongodb.net/lumiform?retryWrites=true&w=majority`

Save both URIs — you will need them in the Render step.

---

## Step 2 — Sentry

> The SDK is already installed and wired up in `backend/src/index.ts` and `backend/src/app.ts`. No
> code changes needed.

1. Go to https://sentry.io and sign in / create account
2. Create a new **project**
   - Projects → Create Project → Platform: **Node.js** → Alert frequency: "Alert me on every new
     issue" → name: `lumiform-backend` → Create Project
3. Copy the **DSN** from the setup page (looks like `https://abc123@o123.ingest.de.sentry.io/456`)
4. Add `SENTRY_DSN` to `backend/.env` for local use
5. You will use this same DSN for both staging and prod Render services — `NODE_ENV` (`staging` /
   `production`) automatically separates events in Sentry under Filters → Environment

---

## Step 3 — Render

1. Go to https://render.com and sign in / create account with GitHub
2. **New → Blueprint** (Render detects `render.yaml`)
   - Connect your GitHub repo `vishnumohanan404/lumiform`
   - Render will show both services from `render.yaml`: `lumiform-api-staging` and
     `lumiform-api-prod`
   - Click **Apply**
3. For each service, set the secret environment variables in the Render dashboard:
   - Open the service → Environment → Add the following:

   **lumiform-api-staging** | Key | Value | |---|---| | `MONGO_URI` | staging Atlas URI from Step 1
   | | `JWT_SECRET` | any long random string (generate with `openssl rand -hex 32`) | | `CLIENT_URL`
   | `https://dev.lumiform.pages.dev` (update after CF Pages step) | | `GOOGLE_CLIENT_ID` | from
   Google Cloud Console | | `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | | `SENTRY_DSN` |
   DSN from Step 2 |

   **lumiform-api-prod** | Key | Value | |---|---| | `MONGO_URI` | prod Atlas URI from Step 1 | |
   `JWT_SECRET` | different long random string | | `CLIENT_URL` | `https://lumiform.pages.dev`
   (update after CF Pages step) | | `GOOGLE_CLIENT_ID` | from Google Cloud Console | |
   `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | | `SENTRY_DSN` | same DSN from Step 2 |

4. Render will trigger an initial deploy for each service on save
5. Once deployed, verify: `https://lumiform-api-staging.onrender.com/api/health` → `{"status":"ok"}`

> **Note:** Free tier services sleep after 15 min inactivity (50s cold start). Upgrade to Starter
> ($7/mo) before going public — one click in the service settings.

---

## Step 4 — Cloudflare Pages

1. Go to https://pages.cloudflare.com and sign in / create account
2. **Create a project** → Connect to Git → select `vishnumohanan404/lumiform`
3. Configure the build:
   - **Production branch:** `main`
   - **Build command:** `npm run build --workspace=client`
   - **Build output directory:** `client/dist`
   - **Root directory:** leave blank (monorepo root)
4. **Environment variables** — set these under Settings → Environment Variables:

   | Variable                | Production value                         | Preview value                               |
   | ----------------------- | ---------------------------------------- | ------------------------------------------- |
   | `VITE_BACKEND_URL`      | `https://lumiform-api-prod.onrender.com` | `https://lumiform-api-staging.onrender.com` |
   | `VITE_GOOGLE_CLIENT_ID` | your Google Client ID                    | your Google Client ID                       |

   > Set each variable with separate Production / Preview values using the toggle in the CF
   > dashboard.

5. **Save and Deploy** — CF Pages builds and deploys `main` to production
6. Preview deployments (from `dev` branch and PRs) are automatic — no extra config needed
7. Note your Pages URLs:
   - Production: `https://lumiform.pages.dev` (or custom domain)
   - Preview: `https://dev.lumiform.pages.dev`
8. Go back to Render and update `CLIENT_URL` on both services to the real CF Pages URLs

---

## Step 5 — UptimeRobot

1. Go to https://uptimerobot.com and sign in / create account
2. **Add New Monitor** for staging:
   - Monitor type: HTTP(s)
   - Friendly name: `Lumiform Staging`
   - URL: `https://lumiform-api-staging.onrender.com/api/health`
   - Monitoring interval: 5 minutes
   - Alert contacts: your email → Create Monitor
3. **Add New Monitor** for prod (same settings):
   - Friendly name: `Lumiform Prod`
   - URL: `https://lumiform-api-prod.onrender.com/api/health`

> UptimeRobot pings will NOT prevent Render free tier from sleeping — Render detects and ignores
> keep-alive pings. These monitors are for downtime alerting only.

---

## Step 6 — Google OAuth (if not already configured)

If Google login is not yet set up for production:

1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials → your OAuth client
3. Add to **Authorised JavaScript origins**:
   - `https://lumiform.pages.dev`
   - `https://dev.lumiform.pages.dev`
4. Add to **Authorised redirect URIs**:
   - `https://lumiform-api-prod.onrender.com/api/auth/google`
   - `https://lumiform-api-staging.onrender.com/api/auth/google`

---

## Post-deploy Verification Checklist

- [ ] `GET https://lumiform-api-prod.onrender.com/api/health` → `{"status":"ok"}`
- [ ] `GET https://lumiform-api-staging.onrender.com/api/health` → `{"status":"ok"}`
- [ ] `https://lumiform.pages.dev` loads the app
- [ ] Login works (JWT + Google OAuth)
- [ ] Create a workspace and form in the editor
- [ ] Publish the form, fill it as an end user, submit
- [ ] Submission appears in the dashboard
- [ ] Sentry dashboard shows the `production` environment
- [ ] UptimeRobot shows both monitors as UP
- [ ] Push a commit to `dev` → Render staging redeploys automatically
- [ ] Push a commit to `main` → Render prod redeploys automatically

---

## Upgrading to Paid (before public launch)

In the Render dashboard:

- Open `lumiform-api-prod` → Settings → Instance Type → change Free → Starter ($7/mo) → Save

No redeployment needed. The service becomes always-on immediately.
