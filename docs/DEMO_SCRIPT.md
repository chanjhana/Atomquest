# Tracko — Demo Script

All three journeys start at the `/login` page. Use the **one-click demo buttons** — no password required.

---

## Employee Journey (`employee@demo.com` → Arun Kumar)

1. **Login as Employee** → lands on My Dashboard
2. Show the status banner (**Approved & Locked**), the three stat cards, and the teal check-in CTA
3. Click **Goal Sheet** → show two approved goals (reliability + automation KPI), weightage bars, shared KPI badge, and locked shared fields
4. Click **Quarterly Check-in** → show Q1 actuals already filled; type a new value and watch the score badge update live
5. Click **History** → show past check-in records

---

## Manager Journey (`manager@demo.com` → Priya Sharma)

1. **Login as Manager** → lands on Team Overview
2. Show the amber **pending approval CTA** and team progress bars
3. Click **Review Now** → open Meena Iyer's pending goal sheet
4. Show inline manager edit (target + weightage editable, shared KPI target locked)
5. **Approve** → toast confirms success, queue updates
6. Click **Team Check-ins** → review Arun Kumar's Q1 actuals, add a manager comment
7. Click **Analytics** → show team achievement charts

---

## Admin Journey (`admin@demo.com` → Ravi Patel)

1. **Login as Admin** → lands on Admin Home
2. Show org stat cards, the red escalation alert, progress bars, and the quick-action grid
3. **Cycles** → change a date, click Activate Cycle → spinner → inline green confirmation
4. **Org Hierarchy** → show reporting lines; use Edit to reassign a manager
5. **Escalations** → show Kiran's Level 1 (goal not submitted) and Meena's Level 2 (approval overdue); click Resolve
6. **Reports & Export** → filter by Q1, click Export CSV → file downloads
7. **Analytics** → walk through all 5 charts (QoQ trend, completion rate, status, thrust area, manager effectiveness)
8. **Audit Logs** → show timestamped submit / approve / check-in events

---

## API Proof Points

Open in browser or show in Network tab:

| Endpoint | What it shows |
|---|---|
| `GET /api/reports/achievement?quarter=q1` | Achievement CSV for Q1 |
| `GET /api/cron/escalations` | Runs escalation check → returns `{ created, advanced, total }` |
