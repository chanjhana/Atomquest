# Tracko — Architecture

**Stack:** Next.js 14 App Router · TypeScript · Prisma · Supabase PostgreSQL · Supabase Auth · Vercel

---

## 1. System Architecture

```mermaid
graph TB
    subgraph Browser["Browser"]
        EU["Employee UI"]
        MU["Manager UI"]
        AU["Admin UI"]
    end

    subgraph Vercel["Next.js 14 on Vercel"]
        MW["Middleware\nRole-cookie guard on /dashboard/*"]

        subgraph Presentation["Presentation Layer"]
            RSC["Server Components\nFetch + render per-role pages"]
            SA["Server Actions\nHandle all mutations"]
        end

        subgraph APIRoutes["API Routes"]
            R1["GET /api/reports/achievement\nStreams achievement CSV"]
            R2["GET /api/cron/escalations\nRuns escalation rule engine"]
        end

        subgraph AppServices["Application Services  ·  lib/services/"]
            AUTH["Auth\nrequireRole · session cookie"]
            LD["Live Data\nAll read queries"]
            MUT["Mutations\nAll write operations"]
            SE["Score Engine\nUoM · score direction"]
            ESC["Escalation Engine\nRule evaluation · level advance"]
            WIN["Cycle Windows\nActive quarter · window open/closed"]
            VAL["Validation\nZod schemas"]
        end

        ORM["Prisma ORM\nType-safe query builder"]
    end

    subgraph Supabase["Supabase (hosted PostgreSQL)"]
        SAUTH["Supabase Auth\nJWT · email login"]
        DB[("PostgreSQL\n9 tables")]
    end

    EU & MU & AU --> MW
    MW --> RSC & SA & R1 & R2
    RSC & SA --> AUTH & LD & MUT & SE & WIN & VAL
    R1 --> LD
    R2 --> ESC
    AUTH --> SAUTH
    LD & MUT & ESC --> ORM
    ORM --> DB
```

---

## 2. Request Lifecycle — Typical Mutation

```mermaid
sequenceDiagram
    actor User
    participant MW as Middleware
    participant SA as Server Action
    participant Auth as requireRole()
    participant SB as Supabase Auth
    participant Svc as Service + Prisma
    participant DB as PostgreSQL

    User->>MW: POST (form submit)
    MW->>MW: Check role cookie on /dashboard/*
    MW-->>User: Redirect /login if missing

    User->>SA: Form data
    SA->>Auth: requireRole(["manager"])
    Auth->>SB: getUser() — validate JWT
    SB-->>Auth: User session
    Auth-->>SA: Typed User object

    SA->>SA: Zod validation
    SA->>Svc: e.g. approveGoalSheet(sheetId, managerId)
    Svc->>DB: Prisma transaction\n(update sheet + write audit log)
    DB-->>Svc: Committed
    Svc-->>SA: Success
    SA-->>User: revalidatePath + return { success }
```

---

## 3. Data Model

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email
        enum   role
        string managerId FK
        string department
        string designation
        string supabaseAuthId
    }

    Cycle {
        string   id PK
        string   name
        datetime goalSettingStart
        datetime goalSettingEnd
        datetime q1Start
        datetime q1End
        datetime q2Start
        datetime q2End
        datetime q3Start
        datetime q3End
        datetime q4Start
        datetime q4End
        boolean  isActive
    }

    GoalSheet {
        string   id PK
        string   userId FK
        string   managerId FK
        string   cycleId FK
        enum     status
        string   returnComment
        datetime submittedAt
        datetime approvedAt
    }

    Goal {
        string  id PK
        string  goalSheetId FK
        string  title
        string  thrustArea
        enum    uomType
        enum    scoreDirection
        string  target
        int     weightage
        boolean isShared
        string  sharedGoalGroupId FK
    }

    SharedGoalGroup {
        string id PK
        string createdByUserId FK
        string primaryOwnerUserId FK
        string cycleId FK
        string title
        enum   uomType
        enum   scoreDirection
        string target
    }

    SharedGoalLink {
        string  id PK
        string  sharedGoalGroupId FK
        string  goalId FK
        string  recipientUserId FK
        boolean isPrimaryOwner
    }

    CheckIn {
        string   id PK
        string   goalId FK
        string   userId FK
        enum     quarter
        string   actualValue
        float    computedScore
        enum     status
        string   employeeComment
        string   managerComment
        boolean  managerCheckedIn
        datetime employeeSubmittedAt
        datetime managerCheckedInAt
    }

    AuditLog {
        string   id PK
        string   userId FK
        string   goalSheetId FK
        string   goalId FK
        string   action
        string   fieldChanged
        string   oldValue
        string   newValue
        string   reason
        datetime createdAt
    }

    Escalation {
        string   id PK
        string   goalSheetId FK
        string   userId FK
        enum     ruleType
        int      escalationLevel
        enum     status
        int      daysPending
        datetime triggeredAt
        datetime resolvedAt
    }

    User        ||--o{ User          : "reports to (managerId)"
    User        ||--o{ GoalSheet     : "owns"
    User        ||--o{ GoalSheet     : "manages"
    Cycle       ||--o{ GoalSheet     : "contains"
    GoalSheet   ||--|{ Goal          : "includes"
    Goal        ||--o{ CheckIn       : "tracked by"
    Goal        ||--o| SharedGoalLink : "linked as recipient"
    SharedGoalGroup ||--|{ SharedGoalLink : "distributed via"
    SharedGoalGroup ||--o{ Goal      : "instantiated as"
    User        ||--o{ SharedGoalGroup : "creates"
    User        ||--o{ SharedGoalGroup : "primary owner"
    User        ||--o{ CheckIn       : "submits"
    User        ||--o{ AuditLog      : "generates"
    User        ||--o{ Escalation    : "assigned to"
    GoalSheet   ||--o{ AuditLog      : "logged against"
    GoalSheet   ||--o{ Escalation    : "escalated for"
    Goal        ||--o{ AuditLog      : "logged against"
```

---

## 4. Module Map

| Module | Location | Responsibility |
|---|---|---|
| Auth | `lib/auth/` | `requireRole()`, session cookie read, Supabase session |
| Live Data | `lib/services/live-data.ts` | All read queries — goal sheets, check-ins, analytics |
| Mutations | `lib/services/mutations.ts` | All write operations — approve, submit, unlock, push shared |
| Score Engine | `lib/services/score-engine.ts` | Pure UoM score computation — numeric, %, timeline, zero |
| Escalation Engine | `lib/services/escalations.ts` | Rule evaluation, level advance, `/api/cron/escalations` |
| Cycle Windows | `lib/services/windows.ts` | Active quarter detection, window open/closed checks |
| Validation | `lib/validation/` | Zod schemas for all server action inputs |
| Server Actions | `app/actions/` | Thin orchestrators — validate → auth → service → revalidate |
| Reports | `lib/services/reports.ts` | Achievement CSV generation |

---

## 5. Role & Feature Matrix

| Feature | Employee | Manager | Admin |
|---|:---:|:---:|:---:|
| Create & submit goal sheet | ✅ | | |
| Enter quarterly actuals (check-in) | ✅ | | |
| View check-in history | ✅ | | |
| Approve / return / edit goal sheet | | ✅ | |
| Push shared departmental KPIs | | ✅ | ✅ |
| Review team check-ins + add comments | | ✅ | |
| Team analytics | | ✅ | |
| Activate cycle & configure windows | | | ✅ |
| Manage org hierarchy | | | ✅ |
| Unlock approved goal sheet | | | ✅ |
| View escalations & resolve | | | ✅ |
| Export achievement CSV | | | ✅ |
| Org-wide analytics (5 charts) | | | ✅ |
| Audit log | | | ✅ |

---

## 6. Deployment

```mermaid
graph LR
    GH["GitHub\nSource"]
    GH -->|push to main| V

    subgraph V["Vercel (Hobby)"]
        NX["Next.js 14\nSSR + Server Actions"]
    end

    subgraph SB["Supabase (Free tier)"]
        AUTH["Auth\nJWT · email"]
        PG[("PostgreSQL\nPrisma schema")]
    end

    V -->|signIn / getUser| AUTH
    V -->|Prisma via pgbouncer :6543| PG
```

**Cost: $0.** Vercel Hobby + Supabase free tier covers the full production workload.
