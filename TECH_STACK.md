# TECH_STACK.md — Technology & Architecture Decisions

## AtomQuest Hackathon 1.0 — In-House Goal Setting & Tracking Portal

**Version:** Lean Hackathon Edition  
**Scope:** Core BRD requirements + Good-to-Have 5.3 Escalation Module + 5.4 Analytics Module

## 1. Stack Selection Principles

This stack is optimized for the actual hackathon scoring criteria: end-to-end functionality, adherence to BRD, low bug risk, user-friendliness, and cost optimization. The goal is not enterprise completeness; the goal is a stable, demo-ready product with a clean architecture and enough extensibility to support the selected bonus features.

Design constraints:
- Keep deployment and setup simple.
- Minimize moving parts.
- Use one frontend app and one managed backend platform.
- Prefer type safety and schema-driven development.
- Support one complete user journey for Employee, Manager, and Admin.

## 2. Final Recommended Stack

### 2.1 Frontend

| Area | Choice | Why this fits the hackathon |
|---|---|---|
| Framework | Next.js 14+ (App Router) | One codebase for UI, server actions, route handlers, auth guards, and deployment. Faster than maintaining separate frontend and backend services. |
| Language | TypeScript | Reduces runtime bugs and keeps validation, API payloads, and DB models aligned. |
| Styling | Tailwind CSS | Fast UI building, predictable styling, and low overhead during hackathon implementation. |
| Component System | shadcn/ui | Accessible, production-ready building blocks without committing to a heavy UI framework. |
| Forms | React Hook Form + Zod | Strong form handling plus shared validation rules for both client and server. |
| Tables | TanStack Table | Useful for team dashboard, audit trail, reports, and admin views. |
| Charts | Recharts | Sufficient for QoQ trends, completion charts, and distribution analytics under feature 5.4. |
| Date Utilities | date-fns | Simple handling for check-in windows, quarter logic, and timeline UoM calculations. |
| Notifications | Sonner | Minimal toast feedback for submit, approve, return, unlock, and save actions. |
| Export | SheetJS (`xlsx`) | Supports CSV/Excel report export required by the BRD. |

### 2.2 Backend / Platform

| Area | Choice | Why this fits the hackathon |
|---|---|---|
| Hosting Backend Platform | Supabase | Gives Postgres, Auth, SQL editor, and deployment-friendly hosted infrastructure in one place. |
| Database | Supabase PostgreSQL | Reliable relational database needed for workflows, audit trail, and reporting joins. |
| Authentication | Supabase Auth | Easy login setup for demo users and role-based access implementation. |
| ORM | Prisma | Clean schema modeling, migrations, and type-safe data access. |
| File/Blob Storage | Not required in v1 | The BRD does not require file uploads, so this is intentionally excluded. |
| Realtime | Not included | Not necessary for the demo or scoring. Avoided to reduce complexity. |
| Edge Functions | Only for escalation cron if implemented | Needed only for feature 5.3 if overdue reminders/escalations are automated. |

### 2.3 Application Layer

| Area | Choice | Why this fits the hackathon |
|---|---|---|
| Mutations | Next.js Server Actions | Fast implementation of create/update/approve/unlock/check-in flows without extra REST boilerplate. |
| Complex Reads | Next.js Route Handlers (`app/api/...`) | Useful for reports, filtered queries, analytics, and export endpoints. |
| Validation | Zod | One source of truth for business rules like weightage total, min goal weightage, and max goals. |
| Authorization | App-level RBAC + optional focused RLS | Enough protection for the hackathon without overengineering every access path. |
| Shared Goal Sync | Prisma transactions + domain service | Keeps shared KPI metadata consistent while allowing per-recipient weightage and audit logging. |

## 3. What is intentionally excluded

The following were removed to keep the build hackathon-safe:
- Microsoft Entra ID / Azure AD integration
- Microsoft Teams integration
- Full email / multi-channel notification delivery
- Supabase Realtime subscriptions
- Generic notifications subsystem
- Full event bus / queue concepts
- Storage buckets and file attachments
- Overly granular microservice-style layering

These features are bonus or infrastructure-heavy items that do not materially improve the score unless the core product is already rock solid. Shared goals are not excluded; they are part of Phase 1 must-have scope.

## 4. Core Functional Coverage Mapping

| BRD Need | Stack support |
|---|---|
| Goal creation and submission | Next.js forms + Server Actions + Prisma + Postgres |
| Validation rules | Zod + server-side business rules |
| Manager approval / return / inline edits | Server Actions + role-aware dashboard |
| Goal locking and admin unlock | Prisma transactions + audit log writes |
| Shared goals | Shared-goal service + linking tables + per-recipient weightage validation |
| Quarterly check-ins | Next.js forms + DB persistence + date-fns |
| UoM-based score computation | Pure TypeScript service using UoM plus score direction |
| Completion dashboard | Prisma queries + admin/manager dashboard |
| Org hierarchy management | Users table hierarchy fields + Admin UI/actions |
| Exportable report | Route handler + SheetJS / CSV export |
| Audit trail | Dedicated audit_logs table + append-only writes |
| Escalation module (5.3) | Scheduled query + escalation table + employee → manager → skip-level/HR chain state |
| Analytics module (5.4) | Aggregation APIs + Recharts visualizations |

## 5. Database Choice Rationale

PostgreSQL is the correct choice because this problem is relational. Users, managers, goal sheets, shared goal groups, linked goals, check-ins, cycles, audit logs, and escalations all depend on strong relationships, filtering, and reporting. A document database would complicate joins, validation, and reporting logic for no benefit.

Supabase is the practical choice because it reduces setup burden. It gives a hosted Postgres database, auth, dashboard, SQL editor, and acceptable free-tier limits in a single service.

Prisma is a good fit because the domain has multiple related entities and evolving schema needs. During a hackathon, Prisma migrations and generated types reduce implementation friction and help keep the frontend and backend aligned.

## 6. Lean Cost Optimization Strategy

This directly supports the cost-optimization evaluation parameter.

| Area | Decision | Cost impact |
|---|---|---|
| App hosting | Vercel Hobby | Free deployment for Next.js app |
| Backend | Supabase Free | Free hosted Postgres + Auth |
| Exports | Client-side Excel/CSV generation | Avoids extra server processing cost |
| Architecture style | Monolith | One deployable app, fewer services |
| Charts | Recharts | No paid BI platform needed |
| Escalation automation | Simple cron / scheduled function only if implemented | No queue infrastructure or worker service |

Expected hackathon cost: effectively zero.

## 7. Final Package List

### Required packages

```bash
npm install @prisma/client @supabase/supabase-js @supabase/ssr date-fns react-hook-form zod @hookform/resolvers @tanstack/react-table recharts sonner xlsx
npm install -D prisma
```

### UI packages

```bash
npx shadcn@latest init
```

Suggested shadcn components:
- button
- card
- dialog
- dropdown-menu
- form
- input
- label
- select
- table
- tabs
- textarea
- toast
- badge
- sheet

## 8. Final Recommendation

This stack is sufficient for the hackathon and intentionally avoids unnecessary complexity. It fully covers the must-have portal requirements, including shared goals and org hierarchy management, and leaves room for exactly two bonus features: rule-based escalation and analytics. That is the right balance between ambition and delivery.
