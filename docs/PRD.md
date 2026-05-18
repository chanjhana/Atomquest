# PRD — Product Requirements Document

## AtomQuest Hackathon 1.0 — In-House Goal Setting & Tracking Portal

**Version:** 2.0  
**Date:** May 17, 2026  
**Status:** Final Lean Scope  
**Scope:** Must-have BRD requirements + Good-to-Have 5.3 Escalation Module + 5.4 Analytics Module

## 1. Problem Statement Summary

Organizations relying on fragmented goal-tracking methods such as spreadsheets, emails, and offline reviews face three persistent problems: poor alignment between employee goals and business priorities, weak visibility for managers during the year, and weak accountability for HR/Admin during reviews and audits [file:1].

The product must solve this by digitizing the full goal lifecycle in one web portal: goal creation, approval, quarterly achievement capture, manager check-ins, reporting, and governance controls such as locking and audit trails [file:1].

## 2. Product Vision

Build a role-aware, audit-ready web application that makes goal setting and progress tracking structured, visible, and easy to operate for Employees, Managers, and Admin/HR. The product must be simple enough for a hackathon demo, but complete enough to satisfy the BRD end-to-end and visibly differentiate itself through escalation and analytics [file:1].

## 3. Goals and Non-Goals

### 3.1 Goals

- Provide employees a self-service interface to create, submit, and track goals against organizational thrust areas [file:1].
- Enable managers to review, edit, approve, and monitor team goals with structured quarterly check-ins [file:1].
- Give Admin/HR control over cycle configuration, exception handling, audit visibility, and reporting [file:1].
- Enforce business rules at system level so compliance is automatic, not manual [file:1].
- Deliver one complete working journey for Employee, Manager, and Admin as required for the hackathon demo [file:1].
- Implement two selected bonus features: rule-based escalation and analytics [file:1].
- Keep the solution cost-optimized and realistic to deploy using free-tier infrastructure [file:1].

### 3.2 Non-Goals

The following are intentionally out of scope for this version:
- Full performance management or compensation workflows
- 360-degree feedback or peer review
- Mobile-native app
- Offline mode / PWA caching
- HRIS or payroll integration
- Microsoft Entra ID / Azure AD integration [file:1]
- Microsoft Teams integration [file:1]
- Generic notifications platform
- Realtime sync as a core dependency
- AI-generated goals or auto-recommendations

## 4. Users and Jobs-to-Be-Done

### 4.1 Employee

| Attribute | Detail |
|---|---|
| Who | Individual contributor or team member |
| Primary JTBD | “I need to define my goals clearly, submit them for approval, and update progress without confusing manual processes.” |
| Key workflows | Create goal sheet → submit for approval → rework if returned → enter quarterly achievement → view progress |
| Pain points | Unclear goal formatting, spreadsheet-based tracking, poor visibility into status |
| Success metric | Can complete the goal creation and quarterly update flow with minimal guidance |

### 4.2 Manager (L1)

| Attribute | Detail |
|---|---|
| Who | Direct supervisor with team reporting responsibility |
| Primary JTBD | “I need to review my team’s goals quickly, keep them aligned, and monitor progress without chasing updates manually.” |
| Key workflows | Review pending approvals → edit/approve/return → review quarterly check-ins → add comments → monitor team completion |
| Pain points | No central approval queue, weak visibility into check-ins, undocumented review discussions |
| Success metric | Can approve or return a team member’s goal sheet quickly and complete team quarterly reviews with minimal friction |

### 4.3 Admin / HR

| Attribute | Detail |
|---|---|
| Who | HR partner or system administrator |
| Primary JTBD | “I need to control the cycle, enforce governance, handle exceptions, and produce reports without manual consolidation.” |
| Key workflows | Configure cycles → activate windows → manage org hierarchy → unlock sheets → view audit logs → view escalations → export reports |
| Pain points | Manual tracking, fragmented data, poor compliance visibility |
| Success metric | Can manage cycle operations, exceptions, and reporting from one dashboard |

## 5. Functional Scope

## 5.1 Phase 1 — Goal Creation & Approval (Must-Have)

### FR-1.1 Goal Sheet Creation

Employees must be able to create a goal sheet for the active cycle [file:1]. Each goal must capture:
- Thrust Area [file:1]
- Goal Title [file:1]
- Goal Description [file:1]
- UoM type: Numeric, Percentage, Timeline, or Zero-based [file:1]
- Target [file:1]
- Weightage [file:1]

### FR-1.2 Validation Rules

The system must enforce the following rules before submission [file:1]:

| Rule | Expected behavior |
|---|---|
| Total weightage = 100% | Block submission if total is not exactly 100; show running total in UI |
| Minimum weightage per goal = 10% | Show inline error and reject submission |
| Maximum goals per employee = 8 | Prevent adding a 9th goal; show goal count indicator |
| At least 1 goal required | Reject empty sheet submission |

Validation must happen both on the client side for better UX and on the server side for integrity.

### FR-1.3 Goal Sheet Draft and Submission

- Employee can save a goal sheet as draft.
- Employee can edit the draft before submission.
- Employee can submit the goal sheet for manager approval [file:1].
- Once submitted, the sheet becomes read-only for the employee until the manager acts.
- Employee may withdraw a submitted but unapproved sheet back to draft.

### FR-1.4 Manager Approval Workflow

Managers must be able to review submitted goal sheets from their direct reports [file:1]. For each goal sheet, the manager can:
- Approve as-is
- Edit target or weightage inline and then approve [file:1]
- Return for rework with comment [file:1]

All manager edits during approval must be tracked in the audit log.

### FR-1.5 Goal Locking and Admin Unlock

- Approved goal sheets must become locked [file:1].
- Employees and managers cannot edit locked sheets.
- Admin can unlock a locked sheet only through an explicit action [file:1].
- Unlock requires a mandatory reason and must create an audit entry.

### FR-1.6 Shared Goals

Shared goals are a Phase 1 must-have requirement [file:1]. The system must support departmental KPIs that can be assigned to multiple employees while preserving a single source of truth for shared goal content and achievement.

Required behavior:
- Admin or manager can push a departmental KPI to multiple employees [file:1].
- The pushed goal appears in each recipient's goal sheet.
- Recipients may adjust only their own weightage [file:1].
- Shared goal title, description, thrust area, UoM, and target remain read-only for recipients [file:1].
- Achievement updates by the primary owner sync across all linked goal sheets [file:1].
- Shared goals must still participate in total weightage validation for each employee goal sheet.
- Shared goal creation, recipient changes, and achievement sync events must be auditable.

## 5.2 Phase 2 — Achievement Tracking & Quarterly Check-ins (Must-Have)

### FR-2.1 Quarterly Achievement Entry

During an active check-in window, employees must be able to log actual achievement for each approved goal [file:1]. Each quarter entry must support:
- Actual achievement [file:1]
- Goal status: Not Started / On Track / Completed [file:1]
- Optional comment

Employees may save progress before final submission.

### FR-2.2 Progress Score Computation

The system must compute goal progress score using the required BRD rules [file:1]:

| UoM Type | Logic | Formula / Rule |
|---|---|---|
| Min (Numeric / %) | Higher is better | Achievement ÷ Target [file:1] |
| Max (Numeric / %) | Lower is better | Target ÷ Achievement [file:1] |
| Timeline | Date-based completion | Completion date vs deadline [file:1] |
| Zero | Zero means success | If 0 then 100%, else 0% [file:1] |

Product decision:
- Scores are for tracking only, not ratings [file:1].
- Numeric and percentage goals must store a score direction because the same UoM can be either higher-is-better or lower-is-better.
- Direction values should be `min` / `higher_is_better` and `max` / `lower_is_better`.
- Scores may be capped at 100% for UI consistency.
- Weighted total may be shown for visibility but should not be presented as appraisal output.

### FR-2.3 Manager Check-in Module

Managers must be able to [file:1]:
- View planned vs actual achievement for each team member
- Review goal-level progress
- Add a structured check-in comment
- Mark check-in review complete

### FR-2.4 Window Enforcement

The system must enforce these windows [file:1]:

| Period | Window | Action |
|---|---|---|
| Goal Setting | Starts 1st May | Goal creation, submission, approval [file:1] |
| Q1 | July | Progress update [file:1] |
| Q2 | October | Progress update [file:1] |
| Q3 | January | Progress update [file:1] |
| Q4 / Annual | March / April | Final achievement capture [file:1] |

Product behavior:
- Closed windows show read-only history.
- Open windows show editable forms.
- Current active window should be visually indicated on relevant dashboards.

## 5.3 Reporting & Governance (Must-Have)

### FR-3.1 Achievement Report

The portal must provide an exportable achievement report in CSV/Excel format showing planned target vs actual achievement for employees [file:1].

Recommended columns:
- Employee name
- Employee ID
- Department
- Goal title
- Thrust area
- UoM
- Target
- Quarter actuals
- Status
- Computed score

### FR-3.2 Completion Dashboard

The portal must provide visibility into who has completed quarterly check-ins and who is pending [file:1].

Recommended views:
- Team-level completion for managers
- Org-wide completion for Admin
- Filter by quarter and cycle

### FR-3.3 Audit Trail

The portal must log all changes made after the lock date, capturing who changed what and when [file:1].

Audit entries should include:
- actor
- action
- target record
- field change if applicable
- old value
- new value
- timestamp
- reason, where applicable

## 5.4 Good-to-Have 5.3 — Escalation Module

### Included scope

Implement a rule-based escalation module for overdue actions [file:1]. Initial supported cases:
- Employee has not submitted goals within N days of cycle open [file:1]
- Manager has not approved goals within N days of submission [file:1]
- Quarterly check-in not completed within active window [file:1]

### Functional expectation

- System detects overdue records on schedule.
- Creates escalation entries.
- Escalation chain should support employee → manager → skip-level / HR after configured intervals [file:1].
- Escalation log is visible to Admin/HR [file:1].
- Escalations can move through statuses such as open, acknowledged, resolved.

### Scope note

Auto-email, Teams messages, or other multi-channel notification delivery is optional. The visible escalation log and chain state are the minimum required proof of implementation.

## 5.5 Good-to-Have 5.4 — Analytics Module

### Included scope

Implement a lightweight analytics dashboard using real application data [file:1]. Suggested analytics:
- QoQ achievement trend [file:1]
- Completion rate by quarter [file:1]
- Goal distribution by status [file:1]
- Goal distribution by thrust area or UoM type [file:1]
- Manager effectiveness comparison [file:1]

### Scope note

This should be a fixed dashboard, not a generic analytics engine.

## 6. Workflow States

### Goal sheet states
- Draft
- Pending Approval
- Returned
- Approved / Locked

### Check-in states
- Not Started
- On Track
- Completed
- Manager Reviewed

### Escalation states
- Open
- Acknowledged
- Resolved

## 7. Acceptance Criteria

### Goal creation and submission
- Employee can create and save a draft goal sheet.
- Employee cannot add more than 8 goals [file:1].
- Employee cannot submit if any goal has weightage below 10 [file:1].
- Employee cannot submit unless total weightage equals 100 [file:1].
- Submitted goal sheet appears in manager pending queue.

### Approval workflow
- Manager can approve without edits.
- Manager can edit target/weightage and approve [file:1].
- Manager can return with comment.
- Approved goal sheet becomes locked [file:1].
- Locked sheet cannot be edited by employee.
- Admin can unlock with mandatory reason.

### Shared goals
- Admin or manager can push a shared departmental KPI to multiple employees [file:1].
- Shared goal recipients can edit only their own weightage [file:1].
- Shared goal title and target are read-only for recipients [file:1].
- Primary-owner achievement updates sync across linked goal sheets [file:1].

### Quarterly check-ins
- Employee can update actuals during valid window only [file:1].
- System computes progress score by UoM rule [file:1].
- Manager can add comment and complete review [file:1].

### Reporting and governance
- Achievement report exports successfully [file:1].
- Completion dashboard shows pending vs completed states [file:1].
- Audit trail captures sensitive changes [file:1].
- Admin/HR can manage or verify reporting hierarchy used by manager dashboards and escalations [file:1].

### Escalation module
- Overdue rules create escalation entries [file:1].
- Admin can view unresolved escalations.

### Analytics module
- Manager/Admin can view at least 3 useful charts built from real data [file:1].

## 8. UX Requirements

Because user friendliness is explicitly evaluated, the interface should emphasize clarity and predictability [file:1].

UX requirements:
- Show running weightage total during goal creation.
- Use clear state labels: Draft, Pending, Returned, Locked.
- Show validation messages inline and at submit time.
- Keep role dashboards focused on actions, not raw data overload.
- Make manager review and admin reporting table-driven and filterable.
- Keep analytics simple and readable.

## 9. Non-Functional Requirements

### Reliability
- Core flows must complete without broken transitions.
- Important write operations should be transactional where appropriate.

### Performance
- App must feel responsive during demo conditions.
- Reports and analytics should rely on efficient aggregated queries.

### Security
- Role-based authorization must be enforced server-side.
- Sensitive operations must be validated on the server.

### Auditability
- Critical state transitions and post-lock changes must be logged [file:1].

### Accessibility
- The product must be usable in a web browser by typical business users [file:1].
- Form labels, clear contrast, and basic keyboard accessibility should be maintained.

## 10. Success Metrics

The product is successful if it demonstrates the evaluation criteria strongly [file:1]:
- End-to-end functionality works for all three roles [file:1].
- BRD rules are implemented correctly [file:1].
- Flows are intuitive and stable [file:1].
- Bugs are minimal in both happy path and common edge cases [file:1].
- Escalation and analytics are visibly implemented [file:1].
- Architecture remains cost-conscious [file:1].

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Overbuilding non-essential features | Delays must-have completion | Prioritize role journeys and core validations first |
| Shared goal sync adds complexity | BRD adherence and demo stability risk | Keep shared-goal v1 narrow: shared metadata is read-only for recipients, only weightage varies per sheet, and achievement sync is primary-owner driven |
| Validation bugs | BRD adherence score drops | Centralize rules in shared validation logic |
| Permission bugs | Demo failures across roles | Test each role separately with seeded accounts |
| Analytics scope creeps | Core UI remains unfinished | Limit analytics to fixed charts only |
| Escalation automation becomes unstable | Bonus feature looks incomplete | Make escalation log work first, automation second |

## 12. Demo Scope Recommendation

### Employee journey
- Login
- Create goal sheet
- Submit for approval
- View assigned shared goal and adjust only weightage
- Enter quarterly check-in

### Manager journey
- Login
- Approve or return submitted goal sheet
- Push shared departmental KPI to selected team members
- Review team check-in
- Add manager comment
- View team completion / analytics

### Admin journey
- Login
- Activate cycle
- Manage or verify org hierarchy
- Unlock goal sheet
- View audit trail
- View escalations
- Export achievement report

## 13. Submission Deliverables Checklist

The final submission must include [file:1]:
- Live / hosted demo URL of the portal.
- Source code repository link.
- Architecture diagram as a PDF or image.
- Login credentials for Employee, Manager, and Admin roles, or a role-switching option for the demo.

## 14. Final Scope Statement

This PRD defines a lean, hackathon-appropriate version of the Goal Setting & Tracking Portal. It preserves all must-have BRD intent, including shared goals, and focuses bonus effort on rule-based escalation and analytics because those add visible value without requiring heavy external integrations [file:1][file:36].
