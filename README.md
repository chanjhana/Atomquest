# Tracko — Performance Management Portal

> Hackathon submission · Goal setting that actually closes the loop.

Tracko is a unified performance management portal for mid-sized organisations. It connects employee goal setting, manager approval workflows, quarterly check-ins with live scoring, and automated escalations into a single product — with no spreadsheets.

---

## Live Demo

**URL:** _add after deploying to Vercel_

### One-click demo accounts

| Role | Email | What to explore |
|---|---|---|
| **Employee** | `employee@demo.com` | Approved goal sheet · Q1 check-in with live scores · Check-in history |
| **Manager** | `manager@demo.com` | Approve Meena's pending sheet · Review Arun's Q1 actuals · Analytics |
| **Admin / HR** | `admin@demo.com` | Activate cycle · Manage org hierarchy · Escalations · CSV export · Charts |

> All three accounts are available as **one-click buttons** on the `/login` page. No password needed.

---

## What it covers

| Area | Detail |
|---|---|
| **Goal setting** | Employees create up to 8 goals with UoM, target, weightage (must total 100%) |
| **Approval workflow** | Manager reviews, approves, edits inline, or returns with a comment |
| **Goal locking** | Approved sheets lock; Admin can unlock with a mandatory audit reason |
| **Shared goals** | Admin/Manager pushes a departmental KPI to multiple employees; primary-owner achievement syncs to recipients |
| **Quarterly check-ins** | Employee enters actual achievement; score computed live by UoM type and score direction |
| **Manager review** | Manager adds comments, marks check-in as reviewed |
| **Escalation module** | Rule-based chain: goal not submitted → not approved → check-in overdue; auto-advances employee → manager → skip-level after configured days |
| **Analytics** | QoQ trend, completion rate, status distribution, thrust-area distribution, manager effectiveness |
| **Reports** | Filterable achievement report with sortable TanStack Table + CSV export |
| **Audit log** | Append-only history of all sensitive changes |
| **Org hierarchy** | Admin manages reporting lines that power approvals and escalation chains |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router (Server Actions, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI primitives | Custom shadcn-style components |
| ORM | Prisma |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth + `@supabase/ssr` |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Toasts | Sonner |
| Icons | Lucide React |
| Date utilities | date-fns |
| Validation | Zod |
| Hosting | Vercel (Hobby — free) |

**Cost: effectively zero.** Vercel Hobby + Supabase free tier covers everything.

---

## Scoring parameter coverage

| # | Parameter | Status |
|---|---|---|
| 5.1 | Goal Setting & Tracking | ✅ Full — creation, validation, submission, locking, unlock |
| 5.2 | Approval Workflow | ✅ Full — approve, return, inline edit, withdraw |
| 5.3 | Escalation Module (bonus) | ✅ Real DB-backed rule engine + `/api/cron/escalations` endpoint |
| 5.4 | Analytics Module (bonus) | ✅ 5 charts — QoQ trend, completion rate, status dist., thrust area, manager effectiveness |
| — | Shared Goals | ✅ Push KPIs, per-recipient weightage, primary-owner achievement sync |
| — | Audit Trail | ✅ Append-only log of all sensitive actions |
| — | Cost Optimisation | ✅ Zero-cost stack (Vercel Hobby + Supabase free) |

---

## Demo walkthrough

### Employee
1. `/login` → Login as Employee
2. **My Dashboard** — see approved goal sheet, Q1 check-in CTA
3. **Goal Sheet** — two goals with weightage, shared KPI badge, locked shared fields
4. **Quarterly Check-in** — enter actual value, watch score update live, submit

### Manager
1. `/login` → Login as Manager
2. **Team Overview** — pending approval alert, team progress bars
3. **Approvals** → review Meena Iyer's pending sheet → Approve or Return
4. **Team Check-ins** → review Arun Kumar's Q1 actuals → add manager comment
5. **Analytics** → team achievement charts

### Admin
1. `/login` → Login as Admin
2. **Admin Home** — org stats, escalation alert, quick-action grid
3. **Cycles** → edit dates → Activate Cycle (watch spinner + inline success)
4. **Org Hierarchy** → see reporting lines that power approvals
5. **Escalations** → view level 1–3 chain, resolve an escalation
6. **Reports & Export** → filter by quarter → Export CSV
7. **Analytics** → 5 org-wide charts
8. **Audit Logs** → timestamped change history

### API proof points
- `GET /api/reports/achievement?quarter=q1` → downloadable CSV
- `GET /api/cron/escalations` → runs escalation check, returns `{ created, advanced, total }`

---

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in your Supabase credentials
cp .env.example .env.local

# 3. Push schema to Supabase and generate Prisma client
npx prisma generate
npx prisma db push

# 4. Seed demo data and Supabase auth users
npm run prisma:seed

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase pooler connection string (pgbouncer) |
| `DIRECT_URL` | Supabase direct connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (used in seed) |
| `DEMO_USER_PASSWORD` | Password set for all demo accounts (default: `Tracko123!`) |

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import into [vercel.com](https://vercel.com) → select the repo
3. Add all environment variables from the table above
4. Deploy
5. Run `npx prisma db push && npm run prisma:seed` against production Supabase once

---

## Project structure

```
app/
  actions/          # Server actions (mutations, auth, check-ins)
  api/              # Route handlers (CSV export, escalation cron)
  dashboard/        # Role-scoped pages (employee / manager / admin)
  login/            # Auth page with one-click demo buttons
components/
  admin/            # Admin-specific UI (cycle form, escalation table, etc.)
  analytics/        # Recharts wrappers
  check-ins/        # Check-in entry row with live score preview
  dashboard/        # Shared status card, completion widget
  goals/            # Goal sheet form, goal row, weightage bar
  layout/           # Sidebar, topbar, app shell, flash toast
  manager/          # Pending approval list, team check-in table
  reports/          # Sortable TanStack report table, filter bar
  ui/               # Primitive components (button, card, input, …)
lib/
  auth/             # requireRole, session, constants
  domain/           # TypeScript types and enums
  services/         # live-data, mutations, score-engine, escalations, windows
  validation/       # Zod schemas
prisma/
  schema.prisma     # Full data model
  seed.ts           # Demo data + Supabase auth user creation
docs/
  ARCHITECTURE.md   # System design and data model
  TECH_STACK.md     # Stack rationale
  PRD.md            # Product requirements
  DEMO_SCRIPT.md    # Step-by-step demo guide
```

---

## Submission checklist

- [ ] Live demo URL added above
- [x] Source code repository
- [x] Demo credentials (one-click at `/login`)
- [x] Architecture diagram — `docs/ARCHITECTURE.md` + `docs/architecture-diagram.mmd`
- [x] Demo script — `docs/DEMO_SCRIPT.md`
