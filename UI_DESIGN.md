# UI_DESIGN.md — UI/UX Design Specification

## AtomQuest Hackathon 1.0 — In-House Goal Setting & Tracking Portal

**Version:** 1.0
**Date:** May 17, 2026
**Scope:** All must-have BRD requirements + Escalation Module (5.3) + Analytics Module (5.4)

---

## 1. Design Language

### 1.1 Philosophy

The portal is a **corporate productivity tool**, not a consumer product. The design should feel like a well-built internal enterprise app: calm, structured, information-dense but not cluttered. Every screen has a clear primary action. Every state is visually distinguishable. No screen should leave a user wondering what to do next.

Three principles govern all design decisions:

1. **Clarity over cleverness** — Labels are descriptive, not minimal. Status badges are worded, not just color-coded. Form errors explain the rule that was violated, not just that something went wrong.
2. **Role-focus** — Each dashboard surface is scoped to the role's actual job. Employees see their sheet and their check-ins. Managers see their team queue. Admins see the full system. No role sees irrelevant data.
3. **Predictable state** — Every object (goal sheet, goal, check-in) always shows a visible state label. Users always know whether something is Draft, Pending, Locked, Returned, or Completed without needing to dig.

### 1.2 Visual Style

| Property | Decision | Rationale |
|----------|----------|-----------|
| **Color scheme** | Neutral base (white / slate-50 background) with a primary blue accent (`blue-600`) | Professional, not playful. Blue is universally read as action/trust in enterprise tools. |
| **Sidebar** | Dark sidebar (`slate-900` / `slate-800`) with white text | Clear separation between navigation and content. Standard enterprise UI convention. |
| **Typography** | Inter (system font fallback) — base 14px, headings 18-24px | High legibility at smaller sizes for dense tables and forms. |
| **Spacing** | 8-point grid (4, 8, 12, 16, 24, 32px) | Predictable rhythm. Tailwind's default scale maps cleanly onto this. |
| **Border radius** | `rounded-md` (6px) for cards and inputs, `rounded-full` for badges | Slightly rounded but not "bubbly" — professional feel. |
| **Shadow** | `shadow-sm` on cards, no heavy elevation | Flat-leaning design. Depth only where it communicates elevation (modals, dropdowns). |

### 1.3 Color Palette

| Purpose | Token | Hex |
|---------|-------|-----|
| **Primary action** | `blue-600` | #2563EB |
| **Primary hover** | `blue-700` | #1D4ED8 |
| **Destructive action** | `red-600` | #DC2626 |
| **Success / Approved** | `green-600` | #16A34A |
| **Warning / Pending** | `amber-500` | #F59E0B |
| **Info / On Track** | `blue-500` | #3B82F6 |
| **Neutral / Draft** | `slate-500` | #64748B |
| **Locked** | `slate-400` | #94A3B8 |
| **Background** | `slate-50` | #F8FAFC |
| **Card surface** | `white` | #FFFFFF |
| **Border** | `slate-200` | #E2E8F0 |
| **Text primary** | `slate-900` | #0F172A |
| **Text secondary** | `slate-500` | #64748B |
| **Sidebar bg** | `slate-900` | #0F172A |
| **Sidebar text** | `slate-100` | #F1F5F9 |
| **Sidebar active** | `blue-600` | #2563EB |

### 1.4 Status Badge Color Map

| Status | Background | Text | Badge label |
|--------|-----------|------|-------------|
| Draft | `slate-100` | `slate-700` | Draft |
| Pending Approval | `amber-100` | `amber-800` | Pending Approval |
| Returned | `red-100` | `red-700` | Returned |
| Approved / Locked | `green-100` | `green-800` | Approved · Locked |
| Not Started | `slate-100` | `slate-600` | Not Started |
| On Track | `blue-100` | `blue-700` | On Track |
| Completed | `green-100` | `green-800` | Completed |
| Manager Reviewed | `purple-100` | `purple-700` | Reviewed |
| Escalation: Open | `red-100` | `red-700` | Open |
| Escalation: Acknowledged | `amber-100` | `amber-800` | Acknowledged |
| Escalation: Resolved | `green-100` | `green-800` | Resolved |

### 1.5 Typography Scale

| Element | Class | Size / Weight |
|---------|-------|---------------|
| Page title | `text-2xl font-semibold text-slate-900` | 24px / 600 |
| Section heading | `text-lg font-medium text-slate-900` | 18px / 500 |
| Card label | `text-sm font-medium text-slate-700` | 14px / 500 |
| Body / table row | `text-sm text-slate-900` | 14px / 400 |
| Helper text | `text-xs text-slate-500` | 12px / 400 |
| Error text | `text-xs text-red-600` | 12px / 400 |
| Badge text | `text-xs font-medium` | 12px / 500 |

### 1.6 Accessibility Targets

- WCAG 2.1 AA minimum.
- All form inputs have associated `<label>` elements.
- Error messages are announced via `aria-live="polite"`.
- All interactive elements are keyboard reachable (Tab, Enter, Space, Escape).
- Color is never the sole indicator of meaning — always paired with text or icon.
- Minimum 4.5:1 contrast ratio on all text.
- Focus rings visible on keyboard navigation.

---

## 2. Layout Architecture

### 2.1 Global Shell

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (h-14, full width)                                   │
│  [Logo]          [Active Window Banner]    [User + Role]     │
├──────────────┬──────────────────────────────────────────────┤
│              │                                               │
│   SIDEBAR    │            MAIN CONTENT                       │
│   (w-56)     │            (flex-1, p-6)                      │
│              │                                               │
│  Role-scoped │  Page title                                   │
│  nav links   │  ─────────                                    │
│              │  Page content                                 │
│              │                                               │
│              │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

**Header:**
- Left: App logo + portal name ("Goal Portal").
- Center: Active window banner — e.g., "Q1 Check-in Window · 12 days remaining" (amber background when < 7 days remaining, green otherwise, hidden when no window is open).
- Right: User avatar + name + role badge + sign-out dropdown.

**Sidebar (dark, `slate-900`):**
- Role-scoped navigation links only (Employee sees Employee links, Manager sees Manager + Employee-own links, Admin sees all).
- Active link highlighted with `blue-600` left border + white text.
- Nav sections grouped by role area with subtle section labels.

**Main Content:**
- White background card or `slate-50` page background.
- Consistent `p-6` padding.
- Page title + optional subtitle at top.
- Primary action button top-right of page title row.

### 2.2 Sidebar Navigation by Role

**Employee:**
- My Goal Sheet
- Quarterly Check-in
- Check-in History

**Manager:**
- Team Overview
- Pending Approvals
- Team Check-ins
- Shared Goals
- Analytics

**Admin:**
- System Overview
- Cycle Management
- Org Hierarchy
- Shared Goals
- Unlock Requests
- Audit Logs
- Escalations
- Reports & Export
- Analytics

---

## 3. Component Inventory

### 3.1 Goal Sheet Form

**Purpose:** Used by Employee to create and edit goals before submission. Also used by Manager during inline approval editing.

**Layout:**
```
┌─ Goal Sheet Form ──────────────────────────────────────────────┐
│  Cycle: FY 2026-27        Status: Draft     [Goals: 3 / 8]     │
│  Total Weightage: [============================] 75% / 100%     │
│  ⚠ 25% remaining to reach 100%                                  │
├────────────────────────────────────────────────────────────────┤
│  GOAL 1                                          [Remove]       │
│  Thrust Area: [Select ▼]   UoM: [Select ▼]   Direction: [▼]   │
│  Title: [__________________________________]                     │
│  Description: [__________________________________________________│
│  ___________________________________________________________]   │
│  Target: [__________]   Weightage: [___]%                       │
│  ⚠ Weightage must be at least 10%                               │
├────────────────────────────────────────────────────────────────┤
│  GOAL 2  (same structure)                        [Remove]       │
├────────────────────────────────────────────────────────────────┤
│  [+ Add Goal]   (hidden when goal count = 8)                    │
├────────────────────────────────────────────────────────────────┤
│              [Save Draft]          [Submit for Approval →]      │
└────────────────────────────────────────────────────────────────┘
```

**Weightage Counter Bar:**
- `<WeightageBar />` component.
- Shows a progress bar filling left-to-right as weightage accumulates.
- Color: `blue-500` when < 100, `green-600` at exactly 100, `red-500` when > 100.
- Label: "X% / 100%" with remaining amount shown below.
- Updates in real-time as user types into any Weightage field.

**Goal Row fields:**
- Thrust Area — `<Select>` with options from `/api/thrust-areas`.
- UoM Type — `<Select>`: Numeric, Percentage, Timeline, Zero-based.
- Score Direction — `<Select>`: Higher is better (Min), Lower is better (Max). Shown only when UoM = Numeric or Percentage. Hidden for Timeline and Zero-based.
- Title — `<Input>` (max 200 chars). Character count shown below.
- Description — `<Textarea>` (max 1000 chars). Optional.
- Target — `<Input>`. Type changes based on UoM: number input for Numeric/Percentage, date picker for Timeline, read-only "0" for Zero-based.
- Weightage — `<Input type="number">` with min=10, max=100.

**Shared Goal Row (recipient view):**
- Title, Description, Thrust Area, UoM, Score Direction, Target are rendered as read-only text (no input).
- A `Shared KPI` badge appears on the goal row header.
- Only Weightage field is editable.
- Tooltip on read-only fields: "This field is set by the goal owner and cannot be changed."

**Validation behavior:**
- Client-side: Zod validates on blur and on submit attempt. Errors appear below each field.
- Submit attempt: All errors shown simultaneously. Scroll to first error.
- If total ≠ 100 at submit: toast error + WeightageBar turns red.
- If goal count = 8: "Add Goal" button is disabled with tooltip "Maximum 8 goals allowed."

**States:**
- **Editable (Draft/Returned):** All fields active, remove buttons visible, Add Goal button active.
- **Read-only (Pending/Locked):** All inputs replaced with display text. No add/remove buttons. Status badge at top.
- **Manager Inline Edit (during approval):** Target and Weightage fields are editable. Other fields read-only. "Save & Approve" replaces "Submit" button.

---

### 3.2 Weightage Validator Component

```
┌─ Weightage Summary ─────────────────────────────────────┐
│  Goal 1: Revenue Target       35%   ████████░░           │
│  Goal 2: Customer NPS         25%   ██████░░░░           │
│  Goal 3: Team Completion      20%   █████░░░░░           │
│  Goal 4: Cost Reduction       20%   █████░░░░░           │
│  ────────────────────────────────────────────────        │
│  Total                       100%   ██████████  ✓        │
└─────────────────────────────────────────────────────────┘
```

- Appears as a sticky sidebar card on the goal creation form (or below on mobile).
- Lists each goal with its current weightage and a mini bar showing proportion.
- Total row turns green with a checkmark at exactly 100.
- Total row turns red with an X icon when over or under.

---

### 3.3 Progress Score Display

**Inline score badge (used in check-in tables and goal sheet views):**
```
  [85%]  ← green badge if ≥ 70, amber if 40-69, red if < 40
```

**Goal-level score card (used in manager check-in review):**
```
┌─ Goal: Revenue Target ─────────────────────────────────────┐
│  UoM: Numeric (Min)   Target: 500   Actual: 425            │
│  Progress: ████████░░  85%   Status: [On Track]            │
│  Formula applied: (425 ÷ 500) × 100 = 85%                 │
└────────────────────────────────────────────────────────────┘
```

**Weighted total score (bottom of check-in form):**
```
  Weighted Overall Score: 78.5%
  (Tracking score only — not a performance rating)
```

Score color thresholds:
- ≥ 80% → `green-600`
- 50–79% → `amber-500`
- < 50% → `red-600`

---

### 3.4 Check-in Entry Row

Used in the quarterly achievement entry form, one row per goal:

```
┌─ Goal: Cost Reduction (Max / Lower is better) ─────────────────┐
│  Target: 10 (TAT days)       [Not Started ▼]                    │
│  Actual: [_______]           Comment: [___________________]     │
│  Score preview: — (enter actual to compute)                     │
└─────────────────────────────────────────────────────────────────┘
```

- Status dropdown: Not Started / On Track / Completed.
- Actual input type matches UoM (number, percentage, date).
- Score preview updates on input blur.
- Locked (read-only) variant used in manager review.

---

### 3.5 Manager Check-in Comment Modal

Triggered when manager clicks "Add Comment & Complete Review" for an employee.

```
┌─ Check-in Review — Arun Kumar · Q1 ───────────────────────────────┐
│                                                                     │
│  PLANNED vs ACTUAL SUMMARY                                          │
│  ┌─────────────────┬────────┬────────┬──────────┬───────┐         │
│  │ Goal            │ Target │ Actual │ Score    │Status │         │
│  ├─────────────────┼────────┼────────┼──────────┼───────┤         │
│  │ Revenue Target  │ 500    │ 425    │ 85%  ●   │On Track│        │
│  │ Cost Reduction  │ 10     │ 12     │ 83%  ●   │On Track│        │
│  │ Safety Incidents│ 0      │ 0      │ 100% ●   │Done   │        │
│  └─────────────────┴────────┴────────┴──────────┴───────┘         │
│                                                                     │
│  Overall Weighted Score: 88.2%                                      │
│                                                                     │
│  Manager Comment (required to complete)                             │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Good progress on revenue and safety. Cost TAT needs     │       │
│  │ attention — recommend reviewing vendor SLAs in Q2.      │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
│               [Cancel]              [Complete Check-in ✓]          │
└─────────────────────────────────────────────────────────────────────┘
```

- Comment is required before "Complete Check-in" button activates.
- Once submitted: comment becomes read-only (append-only). A timestamp and reviewer name are appended.
- Previous check-in comments shown below current form (Q1 comment visible when doing Q2 review, etc.).

---

### 3.6 Manager Approval Inline Editor

Used when manager opens a submitted goal sheet to review.

```
┌─ Review: Priya Sharma's Goal Sheet · FY 2026-27 ──────────────────┐
│  Submitted: 12 May 2026     Status: [Pending Approval]             │
│  ───────────────────────────────────────────────────────           │
│  You may edit Target and Weightage before approving.               │
│                                                                     │
│  ┌───────────────────────────┬─────────┬──────────┬──────────────┐ │
│  │ Goal                      │ UoM     │ Target   │ Weightage    │ │
│  ├───────────────────────────┼─────────┼──────────┼──────────────┤ │
│  │ Revenue Target            │ Numeric │ [500  ▮] │ [35%      ▮] │ │
│  │ Customer NPS              │ %       │ [80   ▮] │ [25%      ▮] │ │
│  │ Team Cert Completion      │ %       │ [90   ▮] │ [20%      ▮] │ │
│  │ Safety Incidents          │ Zero    │ 0        │ [20%      ▮] │ │
│  └───────────────────────────┴─────────┴──────────┴──────────────┘ │
│                                                                     │
│  Total Weightage: 100%  ✓                                           │
│                                                                     │
│  [← Return for Rework]         [Approve Goal Sheet →]              │
└─────────────────────────────────────────────────────────────────────┘
```

- "Return for Rework" opens a comment input dialog before confirming.
- "Approve Goal Sheet" → confirmation dialog → on confirm: sheet locks, audit logged.
- Weightage total recalculates live as manager edits.
- If total ≠ 100 after edits, Approve button is disabled.
- Target for shared goals is read-only even in manager view.
- Manager edits are marked with a subtle `(edited)` indicator on save.

---

### 3.7 Manager Team Table

```
┌─ Team Overview — Q1 2026 ─────────────────────────────────────────┐
│  [Filter by status ▼]   [Search team member...]                   │
│                                                                     │
│  ┌─────────────────┬────────────┬──────────────┬────────────────┐ │
│  │ Employee        │ Dept       │ Sheet Status │ Check-in       │ │
│  ├─────────────────┼────────────┼──────────────┼────────────────┤ │
│  │ Arun Kumar      │ Engineering│ ✓ Locked     │ ● Reviewed     │ │
│  │ Priya Sharma    │ Engineering│ ⏳ Pending   │ — Not started  │ │
│  │ Ravi Patel      │ Sales      │ ✓ Locked     │ ○ Submitted    │ │
│  │ Meena Iyer      │ Sales      │ ↩ Returned   │ — Not started  │ │
│  └─────────────────┴────────────┴──────────────┴────────────────┘ │
│                                                                     │
│  4 team members · 1 pending approval · 1 check-in awaiting review │
└────────────────────────────────────────────────────────────────────┘
```

- Clicking a row navigates to that employee's goal sheet or check-in detail.
- Summary counts at bottom update dynamically.
- Sortable columns: Employee name, Status, Check-in.

---

### 3.8 Audit Log Table

```
┌─ Audit Log ────────────────────────────────────────────────────────┐
│  [Date range ▼]  [Action type ▼]  [Employee ▼]  [Search...]       │
│                                                                     │
│  ┌────────────────┬─────────┬──────────────┬──────────────────┐   │
│  │ Timestamp      │ By      │ Action       │ Detail           │   │
│  ├────────────────┼─────────┼──────────────┼──────────────────┤   │
│  │ 15 May 10:32   │ Ravi    │ Unlock       │ Sheet: Arun K.   │   │
│  │                │ (Admin) │              │ Reason: Thrust..  │   │
│  │ 14 May 09:15   │ Priya   │ Approve      │ Sheet: Meena I.  │   │
│  │                │ (Mgr)   │              │ Inline edit: wt.  │   │
│  │ 13 May 14:00   │ Arun    │ Submit       │ Sheet: Arun K.   │   │
│  └────────────────┴─────────┴──────────────┴──────────────────┘   │
│  Showing 3 of 47 records    [← Prev]  Page 1 of 16  [Next →]      │
└────────────────────────────────────────────────────────────────────┘
```

- Read-only table. No edit actions.
- Row expansion shows full detail: field changed, old value, new value, reason.
- Export-to-CSV button at top right.

---

### 3.9 Completion Dashboard Widget

```
┌─ Q1 Check-in Completion ───────────────────────────────────────────┐
│  Organization overall: 68%  ████████████████░░░░░░░░               │
│                                                                     │
│  By Department:                                                     │
│  Engineering    ████████████████████  100%   8 / 8                 │
│  Sales          ██████████████░░░░░░   70%   7 / 10                │
│  Operations     ████████░░░░░░░░░░░░   40%   4 / 10                │
│                                                                     │
│  Manager Completion:                                                │
│  Priya Sharma   ✓ All 8 reviews done                               │
│  Ravi Patel     ○ 7/10 reviews done                                │
│  Arjun Bose     ✗ 4/10 reviews done                                │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Page-by-Page Wireframe Descriptions

---

### 4.1 LOGIN PAGE

**Route:** `/login`

**Purpose:** Entry point for all roles.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│            [Logo]  Goal Setting & Tracking Portal        │
│                                                          │
│         ┌──────────────────────────────────┐            │
│         │                                  │            │
│         │  Sign in to your account         │            │
│         │                                  │            │
│         │  Email                           │            │
│         │  [____________________________]  │            │
│         │                                  │            │
│         │  Password                        │            │
│         │  [____________________________]  │            │
│         │                                  │            │
│         │         [Sign in →]              │            │
│         │                                  │            │
│         │  ─────── Demo Quick Access ───── │            │
│         │  [Login as Employee]             │            │
│         │  [Login as Manager]              │            │
│         │  [Login as Admin]                │            │
│         └──────────────────────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

- Demo Quick Access buttons are pre-filled one-click logins for the three seed users.
- Error state: "Invalid email or password" shown below the Sign in button as a red inline message.
- After login: middleware reads role and redirects to `/dashboard/employee`, `/dashboard/manager`, or `/dashboard/admin`.

---

### 4.2 EMPLOYEE PAGES

#### 4.2.1 Employee Home (`/dashboard/employee`)

**Purpose:** Overview of current goal sheet status and active window.

**Layout:**
```
┌─ My Dashboard ─────────────────────────────────────────────────────┐
│                                                                     │
│  Active Window: Q1 Check-in · Opens July 1 – July 31              │
│                                                                     │
│  ┌──────────────────────────────┐  ┌───────────────────────────┐  │
│  │ MY GOAL SHEET                │  │ NEXT ACTION               │  │
│  │ FY 2026-27                   │  │                           │  │
│  │ Status: Approved · Locked    │  │ Q1 window opens July 1.   │  │
│  │ Goals: 5  Weightage: 100%    │  │ Prepare your actuals.     │  │
│  │ [View Goal Sheet →]          │  │                           │  │
│  └──────────────────────────────┘  └───────────────────────────┘  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  CHECK-IN HISTORY                                              │ │
│  │  Q1: — Not yet open    Q2: —    Q3: —    Q4: —               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**States:**
- **No goal sheet:** Shows a "Create Goal Sheet" CTA if the goal-setting window is open. If window is closed: "Goal setting window is currently closed. Contact your Admin."
- **Draft:** "Your goal sheet is in draft. Submit before the deadline."
- **Pending:** "Awaiting manager approval."
- **Returned:** Alert card with manager comment. "Edit and resubmit."
- **Locked:** "Your goals are approved and locked."

---

#### 4.2.2 Goal Creation / Edit Form (`/dashboard/employee/goals/new` and `/dashboard/employee/goals/[id]/edit`)

**Purpose:** Create a new goal sheet or edit a Draft/Returned sheet.

See Section 3.1 for full form component spec.

**Page layout:**
```
┌─ My Goal Sheet · FY 2026-27 ──────────────────── [Save Draft]  ─┐
│  Status: Draft     Cycle: FY 2026-27                             │
│                                                                  │
│  ┌─ Weightage Summary (sticky sidebar or top widget) ──────────┐ │
│  │  Total: 75% / 100%  ⚠ 25% remaining                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Goal form rows — see Section 3.1]                              │
│                                                                  │
│  [+ Add Goal]   (disabled at 8 goals)                            │
│                                                                  │
│  [Save Draft]          [Submit for Approval →]                   │
└──────────────────────────────────────────────────────────────────┘
```

**Error states:**
- Window closed: Full-page banner. "Goal setting window is not currently active. Editing is disabled."
- Server error on save: Toast "Failed to save. Please try again."

---

#### 4.2.3 Locked Goal View (`/dashboard/employee/goals/[id]`)

**Purpose:** View an approved and locked goal sheet. Read-only.

```
┌─ My Goal Sheet · FY 2026-27 ─────────────────────────────────────┐
│  Status: [Approved · Locked]    Approved: 14 May 2026            │
│                                                                   │
│  🔒 This goal sheet is locked. Contact your Admin to request      │
│  an unlock if changes are required.                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  GOAL 1 — Revenue Target              Weightage: 35%       │  │
│  │  Thrust Area: Sales Excellence                             │  │
│  │  UoM: Numeric (Higher is better)   Target: 500            │  │
│  │  Description: Achieve monthly sales revenue of 500 units.  │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  GOAL 2 — Cost per Acquisition   [Shared KPI]  Wt: 25%   │  │
│  │  Thrust Area: Operational Excellence                        │  │
│  │  UoM: Numeric (Lower is better)  Target: 10              │  │
│  │  (Shared goal — set by Priya Sharma, Manager)              │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

**Shared goal indicator:** `[Shared KPI]` badge on goal row header. Tooltip: "This goal was assigned by your manager. Title and target cannot be changed."

---

#### 4.2.4 Quarterly Check-in Form (`/dashboard/employee/check-ins`)

**Purpose:** Enter actuals for each goal during an active window.

```
┌─ Q1 Check-in · July 2026 ──────────────────── [Save Progress] ───┐
│  Window: July 1 – July 31 · 18 days remaining                    │
│                                                                   │
│  ┌─ GOAL 1: Revenue Target ─────────────────────────────────┐   │
│  │  UoM: Numeric (Min)      Target: 500                     │   │
│  │  Status: [On Track           ▼]                          │   │
│  │  Actual: [425        ]   Score preview: 85%  ●           │   │
│  │  Comment: [_______________________________________________]│   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─ GOAL 2: Cost per Acquisition [Shared KPI] ─────────────┐    │
│  │  UoM: Numeric (Max)      Target: 10                      │   │
│  │  Status: [On Track           ▼]                          │   │
│  │  Actual: [11.2      ]   Score preview: 89%  ●            │   │
│  │  Note: Achievement synced from primary owner on save.     │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Weighted Overall Score: 87.1%                                    │
│  (Tracking score only — not a performance rating)                 │
│                                                                   │
│                          [Submit Check-in →]                      │
└───────────────────────────────────────────────────────────────────┘
```

**Window closed state:**
```
┌─ Q1 Check-in ──────────────────────────────────────────────────────┐
│  ⚠ The Q1 check-in window is not currently active.                 │
│  Next window: Q2 Check-in opens October 1.                         │
│  [View Previous Check-ins →]                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

#### 4.2.5 Check-in History (`/dashboard/employee/check-ins/history`)

**Purpose:** View past quarters' actuals and scores. Fully read-only.

```
┌─ Check-in History ──────────────────────────────────────────────┐
│  [Q1 ▼]   FY 2026-27                                           │
│                                                                 │
│  ┌─────────────────────┬────────┬────────┬───────┬───────────┐ │
│  │ Goal                │ Target │ Actual │ Score │ Status    │ │
│  ├─────────────────────┼────────┼────────┼───────┼───────────┤ │
│  │ Revenue Target      │ 500    │ 425    │ 85%   │ On Track  │ │
│  │ Cost per Acq.       │ 10     │ 11.2   │ 89%   │ On Track  │ │
│  │ Safety Incidents    │ 0      │ 0      │ 100%  │ Completed │ │
│  ├─────────────────────┼────────┼────────┼───────┼───────────┤ │
│  │ Weighted Score      │        │        │ 87.1% │           │ │
│  └─────────────────────┴────────┴────────┴───────┴───────────┘ │
│                                                                 │
│  Manager comment (Q1):                                          │
│  "Good progress overall. Cost acquisition needs attention."     │
│  — Priya Sharma, Manager · 25 Jul 2026                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.3 MANAGER PAGES

#### 4.3.1 Manager Home / Team Overview (`/dashboard/manager`)

**Purpose:** Dashboard of team statuses for goal sheets and check-ins.

See Section 3.7 for team table component spec.

**Additional summary cards above the table:**
```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ PENDING        │ │ LOCKED         │ │ CHECK-IN       │ │ OVERDUE        │
│ APPROVALS      │ │ SHEETS         │ │ AWAITING       │ │ ESCALATIONS    │
│      2         │ │      6         │ │ REVIEW         │ │      1         │
│ [Review →]     │ │                │ │      3         │ │ [View →]       │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

---

#### 4.3.2 Pending Approvals (`/dashboard/manager/approvals`)

**Purpose:** Queue of submitted goal sheets awaiting manager review.

```
┌─ Pending Approvals ─────────────────────────────────────────────────┐
│  2 goal sheets awaiting your review                                  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Arun Kumar · Engineering         Submitted: 12 May 2026      │  │
│  │  5 goals · Total Weightage: 100%                              │  │
│  │                                      [Review & Approve →]    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Meena Iyer · Sales               Submitted: 11 May 2026     │  │
│  │  4 goals · Total Weightage: 100%                              │  │
│  │                                      [Review & Approve →]    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

- "Review & Approve" → inline approval editor (see Section 3.6).

---

#### 4.3.3 Goal Sheet Review / Inline Approval (`/dashboard/manager/approvals/[id]`)

See Section 3.6 for full inline approval editor spec.

**Return for Rework Modal:**
```
┌─ Return for Rework ─────────────────────────────────────┐
│                                                          │
│  You are returning Arun Kumar's goal sheet.             │
│                                                          │
│  Rework Comment (required)                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Please increase the weightage for the Safety     │   │
│  │ goal and reduce Revenue to balance correctly.    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│              [Cancel]        [Return Sheet ↩]           │
└──────────────────────────────────────────────────────────┘
```

---

#### 4.3.4 Team Check-ins (`/dashboard/manager/check-ins`)

**Purpose:** View all team members' Q-check-in status for the current quarter. Take action on submitted ones.

```
┌─ Team Check-ins · Q1 July 2026 ──────────────────────────────────┐
│  [Quarter: Q1 ▼]   [Status filter ▼]                             │
│                                                                   │
│  ┌─────────────────┬──────────────────────┬─────────────────────┐│
│  │ Employee        │ Submitted on          │ Action              ││
│  ├─────────────────┼──────────────────────┼─────────────────────┤│
│  │ Arun Kumar      │ 20 Jul 2026          │ [Review & Complete] ││
│  │ Ravi Patel      │ 18 Jul 2026          │ [Review & Complete] ││
│  │ Meena Iyer      │ Not submitted        │ —                   ││
│  │ Kiran S.        │ ✓ Reviewed 22 Jul    │ [View]              ││
│  └─────────────────┴──────────────────────┴─────────────────────┘│
└───────────────────────────────────────────────────────────────────┘
```

"Review & Complete" → Check-in comment modal (see Section 3.5).

---

#### 4.3.5 Shared Goals Management (`/dashboard/manager/shared-goals`)

**Purpose:** Create and assign departmental KPIs to direct reports.

```
┌─ Shared Goals ──────────────────────────────── [+ Create Shared Goal]┐
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  COST PER ACQUISITION                           [Shared KPI]    │ │
│  │  Thrust Area: Operational Excellence   UoM: Numeric (Max)       │ │
│  │  Target: 10   Assigned to: 3 employees                          │ │
│  │  Primary Owner: Arun Kumar                                       │ │
│  │  Current Achievement: 11.2   [Synced to all 3 recipients]       │ │
│  │                                               [View Details]    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  [+ Create Shared Goal]                                                │
└────────────────────────────────────────────────────────────────────────┘
```

**Create Shared Goal Modal / Page:**
```
┌─ Create Shared Goal ────────────────────────────────────────────────┐
│  Thrust Area: [Select ▼]                                            │
│  Title: [___________________________________________________]       │
│  Description: [_______________________________________________]     │
│  UoM Type: [Select ▼]     Score Direction: [Select ▼]             │
│  Target: [__________]                                               │
│                                                                     │
│  Assign to employees:                                               │
│  [✓] Arun Kumar     [ ] Meena Iyer     [✓] Ravi Patel             │
│                                                                     │
│  Primary Owner (achievement source): [Arun Kumar ▼]               │
│                                                                     │
│              [Cancel]               [Create & Assign →]            │
└─────────────────────────────────────────────────────────────────────┘
```

---

#### 4.3.6 Analytics (Manager View) (`/dashboard/manager/analytics`)

**Purpose:** Team-level performance charts.

```
┌─ Team Analytics ────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────────────────────┐  ┌────────────────────────────┐│
│  │ QoQ ACHIEVEMENT TREND           │  │ GOAL STATUS DISTRIBUTION  ││
│  │ (Line chart — my team)          │  │ (Donut chart)             ││
│  │  100%                           │  │                           ││
│  │   80% ─────────•               │  │  ● Completed  42%         ││
│  │   60%      •                   │  │  ● On Track   38%         ││
│  │   40%  •                       │  │  ● Not Started 20%        ││
│  │       Q1   Q2   Q3   Q4        │  │                           ││
│  └─────────────────────────────────┘  └────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ GOAL DISTRIBUTION BY THRUST AREA (Bar chart)                   ││
│  │  Revenue Growth     ████████████  12 goals                     ││
│  │  Operational Excl   ████████       8 goals                     ││
│  │  People & Culture   ████            4 goals                    ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 ADMIN PAGES

#### 4.4.1 Admin Home (`/dashboard/admin`)

```
┌─ System Overview ───────────────────────────────────────────────────┐
│                                                                      │
│  Active Cycle: FY 2026-27    Current Window: Goal Setting           │
│  Window closes: 31 May 2026 · 14 days remaining                     │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ Total Users  │ │ Goal Sheets  │ │ Pending      │ │Open        │ │
│  │     48       │ │ Submitted    │ │ Approvals    │ │Escalations │ │
│  │              │ │    32        │ │    8         │ │    3       │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│                                                                      │
│  [View Completion Dashboard →]  [View Escalations →]  [Export →]   │
└──────────────────────────────────────────────────────────────────────┘
```

---

#### 4.4.2 Cycle Management (`/dashboard/admin/cycles`)

**Purpose:** Configure goal-setting and check-in window dates.

```
┌─ Cycle Management ─────────────────────────────── [+ New Cycle] ──┐
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  FY 2026-27                    Status: [ACTIVE]             │  │
│  │                                                              │  │
│  │  Goal Setting: May 1 – May 31, 2026                        │  │
│  │  Q1 Check-in: Jul 1 – Jul 31, 2026                         │  │
│  │  Q2 Check-in: Oct 1 – Oct 31, 2026                         │  │
│  │  Q3 Check-in: Jan 1 – Jan 31, 2027                         │  │
│  │  Q4 / Annual: Mar 1 – Apr 30, 2027                         │  │
│  │                                                              │  │
│  │             [Edit Dates]        [Deactivate]                │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  FY 2025-26                    Status: Inactive             │  │
│  │  ...                                         [Activate]    │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**New/Edit Cycle Modal:**
```
┌─ Configure Cycle ────────────────────────────────────────────────┐
│  Cycle Name: [FY 2026-27_____________________________________]   │
│                                                                   │
│  Goal Setting:  From [01 May 2026 📅]  To [31 May 2026 📅]      │
│  Q1 Check-in:   From [01 Jul 2026 📅]  To [31 Jul 2026 📅]      │
│  Q2 Check-in:   From [01 Oct 2026 📅]  To [31 Oct 2026 📅]      │
│  Q3 Check-in:   From [01 Jan 2027 📅]  To [31 Jan 2027 📅]      │
│  Q4 / Annual:   From [01 Mar 2027 📅]  To [30 Apr 2027 📅]      │
│                                                                   │
│              [Cancel]              [Save Cycle]                  │
└───────────────────────────────────────────────────────────────────┘
```

---

#### 4.4.3 Org Hierarchy Management (`/dashboard/admin/org-hierarchy`)

**Purpose:** View and manage the employee-manager reporting tree used by dashboards and escalation chains.

```
┌─ Org Hierarchy ──────────────────────────── [+ Add User] ─────────┐
│  [Search employee...]   [Filter by department ▼]                  │
│                                                                    │
│  ┌──────────────────┬─────────────┬───────────┬──────────────┐   │
│  │ Employee         │ Department  │ Role      │ Reports to   │   │
│  ├──────────────────┼─────────────┼───────────┼──────────────┤   │
│  │ Arun Kumar       │ Engineering │ Employee  │ Priya Sharma │   │
│  │ Priya Sharma     │ Engineering │ Manager   │ (Admin)      │   │
│  │ Meena Iyer       │ Sales       │ Employee  │ Ravi Patel   │   │
│  │ Ravi Patel       │ Sales       │ Manager   │ (Admin)      │   │
│  └──────────────────┴─────────────┴───────────┴──────────────┘   │
│                                                                    │
│  [Edit] on each row opens a form to change manager assignment.    │
└────────────────────────────────────────────────────────────────────┘
```

**Edit User Modal (admin only):**
- Name, Email (read-only), Department, Designation, Role, Reports To (dropdown of managers).

---

#### 4.4.4 Audit Log (`/dashboard/admin/audit-logs`)

See Section 3.8 for full spec. Expanded row view:

```
┌─ Audit Entry Detail ─────────────────────────────────────────┐
│  Action: Unlock                                               │
│  Performed by: Ravi Patel (Admin)                            │
│  Timestamp: 15 May 2026 · 10:32:05 UTC                       │
│  Goal Sheet: Arun Kumar · FY 2026-27                         │
│  Field changed: status                                        │
│  Old value: approved_locked                                   │
│  New value: draft                                             │
│  Reason: "Employee's thrust area was changed by leadership.  │
│  Targets need updating per new org direction."               │
└───────────────────────────────────────────────────────────────┘
```

---

#### 4.4.5 Escalations (`/dashboard/admin/escalations`)

**Purpose:** View overdue workflow items escalated by the rule engine.

```
┌─ Escalations ────────────────────────────────────────────────────┐
│  [Status: Open ▼]   [Rule type ▼]   [Search employee...]        │
│                                                                   │
│  ┌─────────────────┬──────────────────────┬──────┬────────────┐ │
│  │ Employee        │ Rule                 │ Level│ Status     │ │
│  ├─────────────────┼──────────────────────┼──────┼────────────┤ │
│  │ Meena Iyer      │ Goal not submitted   │ L1   │ [Open]     │ │
│  │                 │ 5 days since open    │      │ [Resolve]  │ │
│  ├─────────────────┼──────────────────────┼──────┼────────────┤ │
│  │ Kiran S.        │ Check-in overdue     │ L2   │ [Open]     │ │
│  │                 │ 9 days in window     │      │ [Resolve]  │ │
│  └─────────────────┴──────────────────────┴──────┴────────────┘ │
│  2 open escalations                                               │
└───────────────────────────────────────────────────────────────────┘
```

- Level 1: Notified employee.
- Level 2: Notified manager.
- Level 3: Notified HR/Admin.
- Admin can mark as Acknowledged or Resolved.

---

#### 4.4.6 Completion Dashboard (`/dashboard/admin/completion`)

See Section 3.9 for widget spec. Full page version adds:
- Drill-down: click department row → expands to employee-level list.
- Manager column shows how many check-in reviews each L1 has completed vs total.
- Export to CSV button.

---

#### 4.4.7 Reports & Export (`/dashboard/admin/reports`)

```
┌─ Achievement Report ────────────────────────────────────────────────┐
│                                                                      │
│  Filters:                                                            │
│  Department: [All ▼]   Manager: [All ▼]   Quarter: [Q1 ▼]          │
│  Thrust Area: [All ▼]  Status: [All ▼]                              │
│                                                                      │
│  [Apply Filters]                                                     │
│                                                                      │
│  Preview (first 5 rows):                                            │
│  ┌─────────────┬──────────────────┬────────┬────────┬──────────┐   │
│  │ Employee    │ Goal             │ Target │ Actual │ Score    │   │
│  ├─────────────┼──────────────────┼────────┼────────┼──────────┤   │
│  │ Arun Kumar  │ Revenue Target   │ 500    │ 425    │ 85%      │   │
│  │ Arun Kumar  │ Cost per Acq.    │ 10     │ 11.2   │ 89%      │   │
│  └─────────────┴──────────────────┴────────┴────────┴──────────┘   │
│                                                                      │
│  Showing 2 of 128 rows                                               │
│                                                                      │
│         [Export as CSV]          [Export as Excel (.xlsx)]          │
└──────────────────────────────────────────────────────────────────────┘
```

---

#### 4.4.8 Analytics (Admin View) (`/dashboard/admin/analytics`)

```
┌─ Organization Analytics ────────────────────────────────────────────┐
│  [Cycle: FY 2026-27 ▼]  [Department: All ▼]                        │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ QoQ ACHIEVEMENT TREND       │  │ CHECK-IN COMPLETION RATE    │  │
│  │ (Org-wide line chart)       │  │ (Bar chart per quarter)     │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ GOAL STATUS DISTRIBUTION    │  │ MANAGER EFFECTIVENESS       │  │
│  │ (Donut — all goals in org)  │  │ (Bar — check-in completion  │  │
│  │                             │  │  rate per L1 manager)       │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ GOAL DISTRIBUTION BY THRUST AREA (Horizontal bar chart)        ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. State Definitions

### 5.1 Empty States

| Screen | Empty Condition | Empty State Message |
|--------|-----------------|---------------------|
| Employee Home | No goal sheet for active cycle + window open | "No goal sheet yet. [Create Your Goals →]" |
| Employee Home | No goal sheet + window closed | "Goal setting window is not open. Your Admin will activate it soon." |
| Pending Approvals | No pending sheets | ✓ illustration + "All caught up! No goal sheets are awaiting your approval." |
| Team Check-ins | No submitted check-ins | "No check-ins submitted yet for this quarter." |
| Audit Log | No logs | "No audit entries found for the selected filters." |
| Escalations | No open escalations | ✓ "No open escalations." |
| Analytics | No data for cycle | "No data available. Analytics will populate once employees begin their check-ins." |

### 5.2 Loading States

- **Full page load:** shadcn `<Skeleton>` components matching the expected layout (skeleton cards, skeleton table rows).
- **Table loading:** Row skeletons with animated pulse in exact column structure.
- **Form submit:** Submit button shows spinner + "Saving..." label. Button disabled. Inputs remain readable.
- **Export:** Button shows "Generating..." with spinner. Re-enables when download starts.
- **Score preview:** Inline "—" until actual is entered, then computes on blur.

### 5.3 Locked States

- **Locked goal sheet (Employee view):** All inputs replaced with display text. A `🔒 Locked` banner at top. "Edit" and "Submit" buttons hidden. "Contact Admin to request unlock" hint shown.
- **Closed window (Employee check-in):** Form disabled with overlay. Message: "The Q[X] check-in window is closed. Edits are not permitted."
- **Shared goal fields (recipient):** Individual fields rendered as static text with a lock icon. Tooltip on hover: "Set by goal owner — cannot be edited."
- **Manager-locked approval (after action):** Approval page redirects to a read-only confirmation. "This goal sheet has been approved and is now locked."

### 5.4 Error States

| Error Type | Presentation |
|------------|-------------|
| Form field invalid | Red border on input + error text below in `text-xs text-red-600`. |
| Submit blocked (weightage ≠ 100) | Toast error: "Total weightage must equal 100%. Currently at X%." + WeightageBar turns red. |
| Submit blocked (< 10% goal) | Inline error on offending goal row: "Minimum weightage per goal is 10%." |
| Submit blocked (> 8 goals) | "Add Goal" button disabled. Tooltip: "Maximum 8 goals allowed." |
| Server error (500) | Toast: "Something went wrong. Please try again." Retry button in toast. |
| Unauthorized access attempt | Full-page: "403 — You don't have permission to view this page. [Go to Dashboard →]" |
| Session expired | Toast: "Your session has expired. Please sign in again." → redirect to /login. |
| Network error | Toast: "Unable to connect. Check your internet connection and try again." |
| Window closed (check-in edit) | Banner on check-in page: "Q1 window closed on July 31. Edits are no longer accepted." |

---

## 6. Responsive Behavior

The portal is desktop-first (enterprise users are on workstations) but should not break on tablets.

| Breakpoint | Behavior |
|------------|---------|
| ≥ 1280px (xl) | Full sidebar + main content. Tables show all columns. |
| 1024px–1279px (lg) | Sidebar collapses to icon-only. Main content full width. |
| 768px–1023px (md) | Sidebar hidden behind hamburger menu. Tables scroll horizontally. |
| < 768px (sm) | Not a priority but should not break. Single-column layout. |

---

## 7. Interaction Patterns

| Pattern | Implementation |
|---------|----------------|
| **Confirm destructive actions** | `AlertDialog` (shadcn) for: Approve, Return, Unlock, Activate Cycle, Delete. Always require explicit confirm. |
| **Toast feedback** | Sonner for: Save success, Submit success, Export started, Server error, Session expired. Duration: 4s. |
| **Inline validation** | Validate on blur (field loses focus). Show all errors on submit attempt. Never block typing. |
| **Optimistic UI** | Use `useOptimistic` or `revalidatePath` after Server Actions for immediate feedback. |
| **Table pagination** | 10 rows per page default. Page controls at bottom. Sortable column headers. |
| **Filters persist** | Store active filters in URL search params so refresh retains state. |
| **Modals** | For short-form actions (comment, return reason, confirm). Full pages for longer forms (goal creation, cycle config). |
| **Deep linking** | Every meaningful state is a URL. `/dashboard/manager/approvals/[id]`, `/dashboard/employee/check-ins`, etc. |
