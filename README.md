# AtomQuest Goal Portal

In-house Goal Setting & Tracking Portal for AtomQuest Hackathon 1.0.

This implementation follows the project source documents:

- `PRD.md`
- `TECH_STACK.md`
- `ARCHITECTURE.md`
- `UI_DESIGN.md`
- `USER_STORIES.md`

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Prisma schema for Supabase PostgreSQL
- Supabase-ready auth helpers
- Zod validation
- Recharts analytics
- CSV export route for achievement reports

## Demo Credentials

The app includes real Supabase sign-in plus one-click quick access at `/login`.

| Role | Email |
|---|---|
| Employee | `employee@demo.com` |
| Manager | `manager@demo.com` |
| Admin / HR | `admin@demo.com` |

Default seeded password: `AtomQuest123!`

## Demo Script

1. Open `/login` and choose `Login as Employee`.
2. Review `/dashboard/employee`, open the goal sheet, verify total weightage, shared KPI badge, and locked shared fields.
3. Open `/dashboard/employee/check-ins` and review Q1 actuals and computed progress scores.
4. Switch to Manager and open `/dashboard/manager/approvals`.
5. Review Arun Kumar's submitted goal sheet, including manager-editable target/weightage behavior and read-only shared target.
6. Open `/dashboard/manager/shared-goals` to show shared KPI assignment.
7. Open `/dashboard/manager/check-ins` and complete a manager review flow.
8. Switch to Admin and open cycle management, org hierarchy, audit logs, escalations, completion dashboard, reports, and analytics.
9. Use `/api/reports/achievement` to download the CSV achievement report.
10. Use `/api/cron/escalations` to show the escalation-check endpoint response.

## Local Setup

```bash
npm install
npm run dev
```

Prisma setup once your Supabase Postgres database is available:

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

## Environment

Copy `.env.example` to `.env.local` and fill in Supabase credentials.

Recommended Supabase Prisma setup:

- `DATABASE_URL`: Supabase pooler connection string
- `DIRECT_URL`: direct database connection string
- Add `sslmode=require` to both URLs

If you want a different seeded login password, set `DEMO_USER_PASSWORD` before running `npm run prisma:seed`.

## Delivery Checklist

- Live / hosted demo URL: pending deployment.
- Source code repository link: pending submission.
- Architecture diagram: see `docs/architecture-diagram.mmd`.
- Role credentials or role switching: available at `/login`.
