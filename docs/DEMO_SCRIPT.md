# Demo Script

## Employee Journey

1. Go to `/login`.
2. Select `Login as Employee`.
3. On `/dashboard/employee`, show sheet status, active cycle, goal count, and total weightage.
4. Open `Goal Sheet` and show validation guidance: max 8 goals, min 10%, total 100%.
5. Point out the `Shared KPI` badge and read-only shared title/target fields.
6. Open `Quarterly Check-in` and show actual achievement, status, comments, and computed score.

## Manager Journey

1. Return to `/login` and select `Login as Manager`.
2. Open `Approvals` and review the pending Arun Kumar sheet.
3. Show inline manager edit behavior: target and weightage can be edited; shared KPI target remains locked.
4. Open `Shared Goals` and show departmental KPI assignment.
5. Open `Team Check-ins` and review planned vs actual data.
6. Open `Analytics` and show team trend/completion/status charts.

## Admin Journey

1. Return to `/login` and select `Login as Admin`.
2. Open `Cycles` and show active workflow windows.
3. Open `Org Hierarchy` and explain that reporting lines power approvals and escalations.
4. Open `Audit Logs` and show submit/shared-goal/unlock events.
5. Open `Escalations` and explain the employee → manager → HR chain.
6. Open `Reports & Export` and download CSV.
7. Open `Analytics` and show org-wide charts.

## API Proof Points

- `/api/reports/achievement` returns a downloadable CSV.
- `/api/cron/escalations` returns escalation-check output.
