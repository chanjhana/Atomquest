# USER_STORIES.md — User Stories & Acceptance Criteria

## AtomQuest Hackathon 1.0 — In-House Goal Setting & Tracking Portal

**Version:** 1.0
**Date:** May 17, 2026
**Format:** Gherkin-style stories with Scenario-based acceptance criteria
**Scope:** All Phase 1 + Phase 2 must-haves + Escalation (5.3) + Analytics (5.4)

---

## Conventions

- Stories are grouped by role and workflow phase.
- Each story includes the narrative form, then one or more `Scenario` blocks in Gherkin.
- `Given` = preconditions. `When` = the action. `Then` = the observable outcome. `And` = additional steps in the same clause.
- Edge cases and alternate flows are captured as additional Scenarios within the same story.
- Story IDs use format `[ROLE-PHASE-NUMBER]` for traceability.

---

## PART 1 — AUTHENTICATION & SESSION

---

### US-AUTH-01: User Login

**As a** user (Employee, Manager, or Admin),
**I want to** sign in with my email and password,
**so that** I can access my role-specific dashboard without seeing other roles' data.

```gherkin
Scenario: Successful login — Employee
  Given I am on the /login page
  And I have a valid Employee account with email "employee@demo.com"
  When I enter "employee@demo.com" and the correct password
  And I click "Sign in"
  Then I am redirected to /dashboard/employee
  And I see the Employee sidebar navigation

Scenario: Successful login — Manager
  Given I have a valid Manager account
  When I sign in with correct credentials
  Then I am redirected to /dashboard/manager
  And I see the Manager sidebar navigation

Scenario: Successful login — Admin
  Given I have a valid Admin account
  When I sign in with correct credentials
  Then I am redirected to /dashboard/admin
  And I see the Admin sidebar navigation

Scenario: Failed login — wrong password
  Given I am on the /login page
  When I enter a valid email but an incorrect password
  And I click "Sign in"
  Then I remain on /login
  And I see the error message "Invalid email or password"
  And no session is created

Scenario: Demo quick access — one-click login
  Given I am on the /login page
  When I click "Login as Employee"
  Then I am signed in as the demo Employee account
  And I am redirected to /dashboard/employee

Scenario: Role-based route protection
  Given I am signed in as an Employee
  When I navigate directly to /dashboard/admin
  Then I am redirected to /dashboard/employee
  And I do not see any admin content
```

---

## PART 2 — PHASE 1: GOAL CREATION & APPROVAL

---

### US-EMP-01: Create a New Goal Sheet

**As an** Employee,
**I want to** create a goal sheet for the active cycle,
**so that** I can define my annual goals and submit them for manager approval.

```gherkin
Scenario: Create goal sheet during open goal-setting window
  Given I am signed in as an Employee
  And the goal-setting window is open for cycle "FY 2026-27"
  And I do not yet have a goal sheet for this cycle
  When I navigate to "My Goal Sheet"
  Then I see a "Create Goal Sheet" button
  When I click "Create Goal Sheet"
  Then a new blank goal sheet is created in Draft status
  And I see the goal creation form with one empty goal row

Scenario: Cannot create goal sheet when window is closed
  Given I am signed in as an Employee
  And the goal-setting window is closed
  When I navigate to "My Goal Sheet"
  Then I see the message "Goal setting window is not currently active"
  And no "Create Goal Sheet" button is visible

Scenario: Goal sheet already exists for cycle
  Given I am signed in as an Employee
  And I already have a Draft goal sheet for "FY 2026-27"
  When I navigate to "My Goal Sheet"
  Then I am taken directly to my existing goal sheet
  And no duplicate sheet is created
```

---

### US-EMP-02: Add Goals to a Goal Sheet

**As an** Employee,
**I want to** add individual goals to my goal sheet with all required attributes,
**so that** each goal is clearly defined and measurable.

```gherkin
Scenario: Add a goal with all required fields
  Given I have a Draft goal sheet open
  When I fill in Goal 1 with:
    | Field         | Value                              |
    | Thrust Area   | Revenue Growth                     |
    | Title         | Achieve Q4 Sales Target            |
    | UoM Type      | Numeric                            |
    | Score Direction| Higher is better                  |
    | Target        | 500                                |
    | Weightage     | 40                                 |
  Then the goal row is saved locally
  And the WeightageBar shows "40% / 100%"

Scenario: Add a Timeline UoM goal
  Given I have a Draft goal sheet open
  When I select UoM Type "Timeline"
  Then the Target field changes to a date picker
  And the Score Direction field is hidden (not applicable)

Scenario: Add a Zero-based UoM goal
  Given I have a Draft goal sheet open
  When I select UoM Type "Zero-based"
  Then the Target field shows "0" as read-only
  And the Score Direction field is hidden (not applicable)

Scenario: Add up to 8 goals
  Given I have a Draft goal sheet with 7 goals
  When I click "Add Goal"
  Then a new goal row appears (total: 8)
  And the "Add Goal" button becomes disabled
  And a tooltip reads "Maximum 8 goals allowed"

Scenario: Cannot add a 9th goal
  Given I have a Draft goal sheet with 8 goals
  When I look at the form
  Then the "Add Goal" button is disabled
  And no 9th goal can be created
```

---

### US-EMP-03: Save a Goal Sheet as Draft

**As an** Employee,
**I want to** save my goal sheet as a draft at any point,
**so that** I do not lose progress before I am ready to submit.

```gherkin
Scenario: Save draft with incomplete weightage
  Given I have a goal sheet with 2 goals totalling 60% weightage
  When I click "Save Draft"
  Then the goal sheet is saved with status "Draft"
  And a success toast "Draft saved" appears
  And no validation errors are shown for weightage

Scenario: Draft persists across sessions
  Given I have saved a Draft goal sheet
  When I sign out and sign back in
  Then my Draft goal sheet is still visible
  And all previously entered goal data is preserved
```

---

### US-EMP-04: Submit Goal Sheet for Approval

**As an** Employee,
**I want to** submit my completed goal sheet for manager approval,
**so that** my manager can review and lock my goals for the year.

```gherkin
Scenario: Successful submission
  Given I have a Draft goal sheet with 4 goals
  And each goal has weightage ≥ 10%
  And the total weightage equals exactly 100%
  When I click "Submit for Approval"
  Then the goal sheet status changes to "Pending Approval"
  And the form becomes read-only
  And a success toast "Goal sheet submitted for approval" appears
  And the goal sheet appears in my manager's pending approval queue

Scenario: Cannot submit when total weightage ≠ 100%
  Given I have a Draft goal sheet with total weightage of 85%
  When I click "Submit for Approval"
  Then submission is blocked
  And I see an error "Total weightage must equal 100%. Currently at 85%."
  And the WeightageBar turns red
  And the goal sheet status remains "Draft"

Scenario: Cannot submit when a goal has weightage < 10%
  Given I have a Draft goal sheet with one goal set to 5% weightage
  When I click "Submit for Approval"
  Then submission is blocked
  And I see an inline error on that goal: "Minimum weightage per goal is 10%"
  And the goal sheet status remains "Draft"

Scenario: Cannot submit an empty goal sheet
  Given I have a Draft goal sheet with no goals added
  When I click "Submit for Approval"
  Then submission is blocked
  And I see "At least one goal is required before submitting."

Scenario: Validation errors are shown simultaneously
  Given I have a Draft goal sheet where both total ≠ 100% and one goal < 10%
  When I click "Submit for Approval"
  Then all errors are shown at the same time
  And I do not need to fix one error to see the next
```

---

### US-EMP-05: Withdraw a Submitted Goal Sheet

**As an** Employee,
**I want to** withdraw my submitted goal sheet before my manager approves it,
**so that** I can make corrections and resubmit.

```gherkin
Scenario: Successful withdrawal
  Given my goal sheet has status "Pending Approval"
  And my manager has not yet acted on it
  When I click "Withdraw Submission"
  Then the goal sheet status changes back to "Draft"
  And the goal form becomes editable again
  And the goal sheet is removed from my manager's pending queue

Scenario: Cannot withdraw an approved sheet
  Given my goal sheet has status "Approved / Locked"
  When I view my goal sheet
  Then no "Withdraw Submission" option is available
```

---

### US-EMP-06: View Locked Goal Sheet

**As an** Employee,
**I want to** view my approved goal sheet in a read-only state,
**so that** I can reference my approved goals during the year without risking accidental edits.

```gherkin
Scenario: Locked goal sheet is read-only
  Given my goal sheet has status "Approved / Locked"
  When I navigate to "My Goal Sheet"
  Then I see all goals displayed as read-only text (no inputs)
  And I see a "🔒 Approved · Locked" status banner
  And no "Edit", "Add Goal", or "Submit" buttons are visible
  And I see the note "Contact your Admin to request an unlock"

Scenario: Shared goals show attribution in locked view
  Given my goal sheet contains a shared KPI goal
  When I view my locked goal sheet
  Then the shared goal shows a "Shared KPI" badge
  And I can see which manager or admin assigned it
```

---

### US-MGR-01: View Pending Approval Queue

**As a** Manager,
**I want to** see all goal sheets from my direct reports awaiting my approval,
**so that** I can prioritize and process them without missing any.

```gherkin
Scenario: View pending submissions
  Given two of my direct reports have submitted goal sheets
  When I navigate to "Pending Approvals"
  Then I see both employees' goal sheets listed
  And each card shows: employee name, submission date, goal count, total weightage

Scenario: Empty approval queue
  Given none of my direct reports have submitted goal sheets
  When I navigate to "Pending Approvals"
  Then I see the message "All caught up! No goal sheets are awaiting your approval."

Scenario: Cannot see other managers' approvals
  Given I am signed in as Manager A
  And Manager B's reports have submitted goal sheets
  When I navigate to "Pending Approvals"
  Then I only see goal sheets from my own direct reports
```

---

### US-MGR-02: Approve a Goal Sheet

**As a** Manager,
**I want to** approve a submitted goal sheet,
**so that** the employee's goals are confirmed and locked for the cycle.

```gherkin
Scenario: Approve without edits
  Given I am reviewing a submitted goal sheet
  And I am satisfied with the goals as submitted
  When I click "Approve Goal Sheet"
  And I confirm in the confirmation dialog
  Then the goal sheet status changes to "Approved / Locked"
  And the employee can no longer edit their goals
  And an audit log entry is created: action = "approve", user = me
  And a success toast "Goal sheet approved and locked" appears

Scenario: Approve after inline edits — Target
  Given I am reviewing a submitted goal sheet
  And I change the Target on Goal 1 from "500" to "450"
  When I click "Approve Goal Sheet"
  Then the edited target is saved
  And the goal sheet is locked with the updated values
  And the audit log records: field = "target", old = "500", new = "450", by = me

Scenario: Approve after inline edits — Weightage
  Given I am reviewing a submitted goal sheet
  And I change the Weightage of Goal 2 from 25% to 30%
  And I adjust Goal 3 from 35% to 30% to keep total at 100%
  When I click "Approve Goal Sheet"
  Then the goal sheet is locked with new weightages
  And the audit log captures both weightage changes

Scenario: Cannot approve if total weightage ≠ 100% after edits
  Given I have edited goal weightages so they total 95%
  When I attempt to click "Approve Goal Sheet"
  Then the Approve button is disabled
  And I see the error "Total weightage must equal 100% before approving."
```

---

### US-MGR-03: Return Goal Sheet for Rework

**As a** Manager,
**I want to** return a goal sheet to the employee with feedback,
**so that** they can make corrections and resubmit.

```gherkin
Scenario: Return with comment
  Given I am reviewing a submitted goal sheet
  And I want the employee to revise their goals
  When I click "Return for Rework"
  And I enter the comment "Please increase Safety goal weightage to at least 15%"
  And I confirm the return
  Then the goal sheet status changes to "Returned"
  And my comment is visible to the employee
  And the employee can now edit and resubmit their goal sheet
  And an audit log entry is created: action = "return"

Scenario: Cannot return without providing a comment
  Given I am on the return dialog
  When I leave the comment field empty
  And I click "Return Sheet"
  Then the return is blocked
  And I see "A rework comment is required before returning."

Scenario: Employee can see return reason
  Given my goal sheet was returned by my manager
  When I navigate to "My Goal Sheet"
  Then I see the status "Returned"
  And I see my manager's comment prominently displayed
  And I can edit and resubmit the goal sheet
```

---

### US-ADMIN-01: Unlock a Locked Goal Sheet

**As an** Admin,
**I want to** unlock an approved goal sheet with a mandatory reason,
**so that** an employee can make corrections under exceptional circumstances while maintaining a full audit trail.

```gherkin
Scenario: Successful unlock with reason
  Given a goal sheet has status "Approved / Locked"
  When I navigate to the goal sheet in Admin view
  And I click "Unlock Goal Sheet"
  And I enter the reason "Employee's thrust area changed — targets need revision"
  And I confirm the unlock
  Then the goal sheet status changes to "Draft"
  And the employee can now edit their goal sheet
  And an audit log entry is created:
    | Field      | Value                                              |
    | Action     | unlock                                             |
    | Old value  | approved_locked                                    |
    | New value  | draft                                              |
    | Reason     | Employee's thrust area changed — targets need...   |
    | By         | Admin user                                         |

Scenario: Cannot unlock without providing a reason
  Given I am on the unlock dialog for a locked goal sheet
  When I leave the reason field empty
  And I click "Confirm Unlock"
  Then the unlock is blocked
  And I see "A reason is required to unlock a goal sheet."

Scenario: Manager cannot unlock
  Given I am signed in as a Manager
  When I view a locked goal sheet
  Then no "Unlock" option is visible
  And if I attempt to call the unlock API directly, I receive a 403 response
```

---

### US-SHARED-01: Create and Assign a Shared Goal

**As a** Manager or Admin,
**I want to** create a shared departmental KPI and push it to selected employees,
**so that** all assigned employees work toward a common measurable target.

```gherkin
Scenario: Create and assign shared goal
  Given I am signed in as a Manager
  When I navigate to "Shared Goals"
  And I click "Create Shared Goal"
  And I fill in:
    | Field            | Value                     |
    | Thrust Area      | Operational Excellence    |
    | Title            | Cost per Acquisition      |
    | UoM Type         | Numeric                   |
    | Score Direction  | Lower is better (Max)     |
    | Target           | 10                        |
  And I select employees: Arun Kumar, Meena Iyer
  And I set the primary owner as Arun Kumar
  And I click "Create & Assign"
  Then the shared goal group is created
  And the goal appears in Arun Kumar's goal sheet as a Shared KPI
  And the goal appears in Meena Iyer's goal sheet as a Shared KPI
  And both copies have Title, Thrust Area, UoM, and Target as read-only
  And an audit log entry is created: action = "shared_goal_create"

Scenario: Recipient cannot edit shared goal title or target
  Given I am signed in as Employee (Arun Kumar)
  And my goal sheet contains a shared KPI goal
  When I view the goal
  Then Title, Thrust Area, UoM Type, Score Direction, and Target are displayed as static text
  And only the Weightage field is an editable input

Scenario: Shared goal still counts toward weightage total
  Given my goal sheet has 3 goals totalling 70%
  And a shared KPI goal is added with 20% weightage
  Then the WeightageBar shows "90% / 100%"
  And I must bring total to 100% before I can submit
```

---

### US-SHARED-02: Shared Goal Achievement Sync

**As an** Admin,
**I want** the primary owner's achievement update to sync to all linked recipients' check-ins,
**so that** all employees referencing the same shared KPI see consistent actual data.

```gherkin
Scenario: Primary owner updates achievement — syncs to all recipients
  Given a shared goal "Cost per Acquisition" is linked to Arun Kumar (primary) and Meena Iyer (recipient)
  And the Q1 check-in window is open
  When Arun Kumar enters actual = "11.2" and submits his Q1 check-in
  Then Meena Iyer's Q1 check-in for the same shared goal also shows actual = "11.2"
  And Meena Iyer's computed score for that goal is also updated
  And an audit log entry is created: action = "shared_goal_sync"

Scenario: Recipient cannot override synced actual
  Given a shared goal has synced actual = "11.2" from the primary owner
  When Meena Iyer views her Q1 check-in
  Then the actual field for the shared goal is read-only
  And it shows the note "Achievement synced from primary owner"
```

---

## PART 3 — PHASE 2: ACHIEVEMENT TRACKING & QUARTERLY CHECK-INS

---

### US-EMP-07: Enter Quarterly Achievement

**As an** Employee,
**I want to** enter my actual achievement against each approved goal during an active check-in window,
**so that** my progress is recorded and visible to my manager.

```gherkin
Scenario: Enter actuals during open Q1 window
  Given my goal sheet is "Approved / Locked"
  And the Q1 check-in window is open (July 1 – July 31)
  When I navigate to "Quarterly Check-in"
  Then I see each of my approved goals with their targets
  And I can enter an actual value and status for each goal
  And a score preview updates when I enter a value

Scenario: Save progress before final submission
  Given I am on the Q1 check-in form
  When I enter actuals for 3 of my 5 goals
  And I click "Save Progress"
  Then the entered values are saved
  And I can return later to complete the remaining goals
  And the check-in status remains "In Progress"

Scenario: Submit final check-in
  Given I have entered actuals and status for all my goals
  When I click "Submit Check-in"
  Then the Q1 check-in is finalized for this quarter
  And a success toast "Q1 check-in submitted" appears
  And the data appears in my manager's team check-in dashboard

Scenario: Cannot enter actuals when window is closed
  Given the Q1 check-in window is closed
  When I navigate to "Quarterly Check-in"
  Then I see the message "The Q1 check-in window is not active"
  And all actual input fields are disabled
  And the Submit button is not visible
```

---

### US-EMP-08: Progress Score Computation

**As an** Employee,
**I want to** see my progress score computed automatically after entering actuals,
**so that** I understand how I am performing against each goal without manual calculation.

```gherkin
Scenario: Score for Min/Numeric goal (higher is better)
  Given I have a goal: UoM = Numeric, Direction = Higher is better, Target = 500
  When I enter Actual = 425
  Then the system computes score = (425 ÷ 500) × 100 = 85%
  And the score is displayed as "85%" with a green/amber/red color based on threshold

Scenario: Score for Max/Numeric goal (lower is better)
  Given I have a goal: UoM = Numeric, Direction = Lower is better, Target = 10
  When I enter Actual = 12
  Then the system computes score = (10 ÷ 12) × 100 = 83.3%
  And the score is displayed as "83%"

Scenario: Score for Timeline goal — completed on time
  Given I have a goal: UoM = Timeline, Target (deadline) = 2026-07-31
  When I enter Actual (completion date) = 2026-07-25
  Then the system computes score = 100%

Scenario: Score for Timeline goal — completed late
  Given I have a goal: UoM = Timeline, Target (deadline) = 2026-07-31
  When I enter Actual (completion date) = 2026-08-05
  Then the system computes score = 0%

Scenario: Score for Zero-based goal — success
  Given I have a goal: UoM = Zero-based, Target = 0
  When I enter Actual = 0
  Then the system computes score = 100%

Scenario: Score for Zero-based goal — failure
  Given I have a goal: UoM = Zero-based, Target = 0
  When I enter Actual = 2
  Then the system computes score = 0%

Scenario: Score capped at 100%
  Given I have a Min/Numeric goal with Target = 100
  When I enter Actual = 130
  Then the system computes raw score = 130% but displays 100%
  And raw overachievement may be stored internally but UI shows max 100%

Scenario: Weighted overall score displayed
  Given I have 3 goals with individual scores and weightages:
    | Goal | Score | Weightage |
    | A    | 85%   | 40%       |
    | B    | 90%   | 35%       |
    | C    | 100%  | 25%       |
  Then the weighted overall score = (85×40 + 90×35 + 100×25) / 100 = 90.5%
  And the page shows "Weighted Overall Score: 90.5%"
  And a disclaimer reads "(Tracking score only — not a performance rating)"
```

---

### US-MGR-04: Manager Check-in Review

**As a** Manager,
**I want to** review each team member's quarterly actual vs planned data and add a structured comment,
**so that** check-in discussions are documented and the review is marked complete.

```gherkin
Scenario: View team check-in dashboard
  Given 3 of my 5 direct reports have submitted their Q1 check-ins
  When I navigate to "Team Check-ins"
  And I select quarter "Q1"
  Then I see all 5 team members
  And 3 show "Submitted" status with a "Review & Complete" action
  And 2 show "Not submitted"

Scenario: Review an individual's check-in
  Given Arun Kumar has submitted his Q1 check-in
  When I click "Review & Complete" for Arun Kumar
  Then I see a table with:
    | Goal title | Target | Actual | Computed Score | Status   |
    | Revenue    | 500    | 425    | 85%            | On Track |
    | Cost Acq.  | 10     | 11.2   | 83%            | On Track |
  And I see Arun's weighted overall score
  And I see a mandatory comment field

Scenario: Complete check-in with comment
  Given I am reviewing Arun Kumar's Q1 check-in
  When I enter the comment "Good trajectory overall. Focus on cost optimization in Q2."
  And I click "Complete Check-in"
  Then the check-in is marked as "Manager Reviewed" for Arun Kumar in Q1
  And the comment is saved as read-only with a timestamp and my name
  And the completion dashboard updates Arun Kumar's row to "Reviewed"

Scenario: Cannot complete check-in without comment
  Given I am reviewing an employee's check-in
  When I click "Complete Check-in" with an empty comment field
  Then the action is blocked
  And I see "A check-in comment is required before completing the review."

Scenario: Previous quarter comments visible during current review
  Given Q1 check-in was reviewed with comment "Focus on cost in Q2"
  When I am reviewing the same employee's Q2 check-in
  Then I can see the Q1 manager comment below the current form
```

---

### US-WINDOW-01: Window Enforcement

**As the** system,
**I want to** restrict achievement entry to defined quarterly windows,
**so that** all progress data is captured at the correct time and historical records are not altered.

```gherkin
Scenario: Check-in entry blocked outside window
  Given today is June 15 (outside all check-in windows)
  When an Employee navigates to "Quarterly Check-in"
  Then all input fields are disabled
  And the page shows "No check-in window is currently active"

Scenario: Window opens and enables entry
  Given today is July 1 (Q1 window opens)
  When an Employee navigates to "Quarterly Check-in"
  Then the Q1 check-in form is enabled
  And a banner shows "Q1 Check-in Window · Closes July 31 · 30 days remaining"

Scenario: Window closes and locks submissions
  Given an Employee has saved a draft Q1 check-in but not yet submitted
  When the Q1 window closes (July 31 passes)
  Then the check-in form becomes read-only
  And no further edits are accepted for Q1
  And the draft data is preserved in read-only view
```

---

## PART 4 — REPORTING & GOVERNANCE

---

### US-ADMIN-02: Configure and Activate a Cycle

**As an** Admin,
**I want to** create and activate a goal cycle with defined window dates,
**so that** the system knows when each workflow phase is open for Employees and Managers.

```gherkin
Scenario: Create a new cycle
  Given I am signed in as Admin
  When I navigate to "Cycle Management"
  And I click "New Cycle"
  And I fill in the cycle name "FY 2026-27"
  And I set window dates for goal setting, Q1, Q2, Q3, and Q4
  And I click "Save Cycle"
  Then the new cycle appears in the cycle list with status "Inactive"

Scenario: Activate a cycle
  Given a cycle "FY 2026-27" exists with status "Inactive"
  When I click "Activate"
  Then "FY 2026-27" becomes the active cycle
  And any previously active cycle is deactivated
  And employees can now create goal sheets for this cycle

Scenario: Only one cycle is active at a time
  Given "FY 2025-26" is the active cycle
  When I activate "FY 2026-27"
  Then "FY 2025-26" becomes "Inactive"
  And "FY 2026-27" becomes "Active"

Scenario: Edit cycle dates before activation
  Given a cycle is "Inactive"
  When I click "Edit Dates" and update the Q2 window dates
  And I click "Save Cycle"
  Then the new dates are saved
  And the system enforces the updated window going forward
```

---

### US-ADMIN-03: Export Achievement Report

**As an** Admin or Manager,
**I want to** export a Planned vs Actual achievement report in CSV or Excel format,
**so that** I can share or analyze goal data outside the portal.

```gherkin
Scenario: Admin exports org-wide report
  Given I am signed in as Admin
  And multiple employees have submitted Q1 check-ins
  When I navigate to "Reports & Export"
  And I set filter Quarter = Q1 and click "Apply Filters"
  And I click "Export as Excel"
  Then an Excel file is downloaded
  And the file contains columns: Employee Name, Department, Goal Title, Thrust Area, UoM, Target, Actual, Score, Status
  And all employees matching the filters are included

Scenario: Manager exports team-only report
  Given I am signed in as Manager
  When I navigate to "Reports"
  And I export
  Then the file contains only my direct reports' data
  And data from other teams is not included

Scenario: Export as CSV
  Given I am on the Reports page
  When I click "Export as CSV"
  Then a CSV file is downloaded with the same columns as the Excel export

Scenario: Export with filters applied
  Given I apply filters: Department = Engineering, Quarter = Q2
  When I click "Export"
  Then only Engineering employees and Q2 data appear in the file
```

---

### US-ADMIN-04: View Completion Dashboard

**As an** Admin or Manager,
**I want to** see a real-time view of which employees and managers have completed each workflow step,
**so that** I can identify and follow up on incomplete submissions quickly.

```gherkin
Scenario: Admin views org-wide completion
  Given I am signed in as Admin
  When I navigate to "Completion Dashboard"
  Then I see overall completion percentage for the current window
  And I see department-level breakdown: submitted vs total
  And I see manager-level breakdown: reviews completed vs total team size

Scenario: Manager views team completion
  Given I am signed in as Manager
  When I navigate to my Team Overview
  Then I see my team members' goal sheet status (Draft / Pending / Locked / Returned)
  And I see check-in status for the current quarter (Not started / Submitted / Reviewed)
  And I can identify who has not yet acted

Scenario: Completion rates update in real-time
  Given I am viewing the Completion Dashboard
  When an employee submits their goal sheet
  Then the pending count decreases by 1
  And the submitted count increases by 1
  (Note: may require page refresh if Realtime is not implemented)
```

---

### US-ADMIN-05: View and Filter Audit Logs

**As an** Admin,
**I want to** view a complete, filterable audit trail of all changes made after goal sheets are locked,
**so that** I can investigate any exception or dispute with full traceability.

```gherkin
Scenario: View audit log entries
  Given several changes have been made to goal sheets
  When I navigate to "Audit Logs"
  Then I see a table with columns: Timestamp, Performed By, Action, Detail

Scenario: Filter audit log by action type
  Given I want to see all unlock events
  When I select Action filter = "Unlock"
  Then the table shows only rows where action = "unlock"

Scenario: Filter by employee
  Given I want to see all changes related to Arun Kumar's goal sheet
  When I search for "Arun Kumar" in the employee filter
  Then only audit entries related to Arun Kumar's sheet are shown

Scenario: Expand audit log row for full detail
  Given I see an "Unlock" entry in the audit log
  When I expand the row
  Then I see: field changed, old value, new value, reason provided by Admin

Scenario: Audit log is read-only — no edits possible
  Given I am an Admin viewing the audit log
  Then I see no edit, delete, or modify controls
  And all entries are displayed as static read-only data

Scenario: Manager edit during approval is logged
  Given a Manager edited the Target field of a goal before approving
  Then the audit log contains an entry:
    | action        | manager_edit         |
    | field_changed | target               |
    | old_value     | 500                  |
    | new_value     | 450                  |
    | performed_by  | Manager name         |
```

---

### US-ADMIN-06: Org Hierarchy Management

**As an** Admin,
**I want to** manage the employee-manager reporting hierarchy,
**so that** manager dashboards, approval queues, and escalation chains correctly reflect the org structure.

```gherkin
Scenario: View org hierarchy
  Given I am signed in as Admin
  When I navigate to "Org Hierarchy"
  Then I see a table with: Employee Name, Department, Role, Reports To

Scenario: Change an employee's manager
  Given Arun Kumar currently reports to Priya Sharma
  When I click "Edit" on Arun Kumar's row
  And I change "Reports To" to "Ravi Patel"
  And I save
  Then Arun Kumar's manager is updated to Ravi Patel
  And Arun Kumar's goal sheet now appears in Ravi Patel's approval queue
  And Priya Sharma no longer sees Arun Kumar in her team dashboard

Scenario: Create a new user
  Given I need to add a new employee
  When I click "Add User" and fill in the user form
  And I assign them a manager and department
  And I save
  Then the new user can log in
  And they appear in their assigned manager's team view

Scenario: Change user role
  Given an employee is being promoted to Manager
  When I edit their record and change Role from "employee" to "manager"
  Then they can access the Manager dashboard
  And other employees can be assigned to report to them
```

---

## PART 5 — ESCALATION MODULE (Good-to-Have 5.3)

---

### US-ESC-01: Escalate Overdue Goal Submission

**As the** system,
**I want to** detect and flag employees who have not submitted their goal sheet within N days of the goal-setting window opening,
**so that** Admin/HR can take action and ensure compliance.

```gherkin
Scenario: Escalation created for overdue submission
  Given the goal-setting window opened 8 days ago
  And Employee "Meena Iyer" has not yet submitted a goal sheet
  And the configured threshold is 5 days
  When the escalation check runs
  Then an escalation record is created:
    | user_id    | Meena Iyer          |
    | rule_type  | goal_not_submitted  |
    | escalation_level | 1             |
    | status     | open                |

Scenario: Admin sees escalation in escalation log
  Given an escalation exists for Meena Iyer
  When I navigate to "Escalations"
  Then I see Meena Iyer listed with rule "Goal not submitted" and status "Open"
  And I see the number of days overdue

Scenario: Escalation advances to Level 2 after further delay
  Given a Level 1 escalation exists for Meena Iyer
  And the configured Level 2 interval (3 additional days) has passed
  When the escalation check runs again
  Then the escalation record is updated to escalation_level = 2
  And the escalation log reflects the new level

Scenario: Admin resolves an escalation
  Given an open escalation exists for Meena Iyer
  When I click "Resolve" in the Escalation log
  Then the escalation status changes to "Resolved"
  And a resolved_at timestamp is recorded
  And the escalation no longer appears in the "Open" filter
```

---

### US-ESC-02: Escalate Overdue Manager Approval

**As the** system,
**I want to** detect and flag goal sheets that have been pending manager approval for more than N days,
**so that** bottlenecks in the approval workflow are visible to Admin/HR.

```gherkin
Scenario: Escalation created for overdue approval
  Given Arun Kumar submitted his goal sheet 7 days ago
  And his manager has not yet approved or returned it
  And the configured threshold is 5 days
  When the escalation check runs
  Then an escalation record is created:
    | user_id    | Arun Kumar (or Manager) |
    | rule_type  | approval_pending        |
    | status     | open                    |

Scenario: Escalation visible to Admin
  Given the approval escalation is created
  When I navigate to "Escalations"
  Then I see the entry with employee name, manager name, and days pending
```

---

### US-ESC-03: Escalate Overdue Quarterly Check-in

**As the** system,
**I want to** detect employees who have not submitted their check-in during an active quarterly window after N days,
**so that** Admin/HR is aware and can prompt action.

```gherkin
Scenario: Escalation created for overdue check-in
  Given the Q1 window has been open for 15 days
  And Employee "Kiran S." has not submitted a check-in
  And the configured threshold is 10 days
  When the escalation check runs
  Then an escalation record is created:
    | rule_type  | checkin_overdue |
    | user_id    | Kiran S.        |
    | status     | open            |

Scenario: Escalation auto-resolves when check-in is submitted
  Given an open check-in escalation exists for Kiran S.
  When Kiran S. submits their Q1 check-in
  Then the escalation status is updated to "Resolved"
  And resolved_at is set to the current timestamp
```

---

## PART 6 — ANALYTICS MODULE (Good-to-Have 5.4)

---

### US-ANL-01: View QoQ Achievement Trend

**As a** Manager or Admin,
**I want to** see a quarter-on-quarter achievement trend chart,
**so that** I can identify whether performance is improving, declining, or steady over the year.

```gherkin
Scenario: Manager views team QoQ trend
  Given Q1 and Q2 check-ins have been completed for my team
  When I navigate to "Analytics"
  Then I see a line chart with quarters Q1–Q4 on the X axis
  And weighted average achievement percentage on the Y axis
  And only my team's data is plotted

Scenario: Admin views org-wide QoQ trend
  Given multiple departments have completed Q1 and Q2 check-ins
  When I navigate to "Analytics" as Admin
  Then I see the org-wide trend line
  And I can filter by department to drill down

Scenario: Incomplete quarters shown as partial
  Given Q1 data exists but Q2 window has not yet started
  When I view the QoQ trend chart
  Then Q1 shows a data point
  And Q2 onward is shown as a projected/empty line or omitted
```

---

### US-ANL-02: View Completion Rate Chart

**As an** Admin or Manager,
**I want to** see a bar chart of check-in completion rates by quarter,
**so that** I can assess participation rates across the organization or team.

```gherkin
Scenario: View completion bar chart
  Given Q1 check-in data is available
  When I view the Completion Rate chart
  Then I see bars for each quarter (Q1–Q4)
  And each bar shows percentage of employees who submitted their check-in
  And I see the raw numbers (e.g., "32 / 48" employees)

Scenario: Filter by department
  Given I filter the chart by Department = Engineering
  Then the completion rate shows only Engineering headcount in the calculation
```

---

### US-ANL-03: View Goal Status Distribution

**As a** Manager or Admin,
**I want to** see a donut or pie chart of goal status distribution,
**so that** I can understand how many goals are on track, completed, or not started across the org or team.

```gherkin
Scenario: View goal status donut chart
  Given Q1 check-in data is available
  When I view the Goal Status Distribution chart
  Then I see proportions for: Not Started, On Track, Completed
  And the chart legend shows both percentage and count
  And hovering on a segment shows the exact value

Scenario: Distribution reflects current quarter data
  Given the user has selected quarter "Q1"
  When I view the chart
  Then only Q1 check-in statuses are used in the calculation
```

---

### US-ANL-04: View Goal Distribution by Thrust Area

**As an** Admin,
**I want to** see how many goals exist for each thrust area,
**so that** I can verify that organizational priorities are reflected proportionally in employee goal sheets.

```gherkin
Scenario: View thrust area distribution bar chart
  Given multiple employees have approved goal sheets
  When I view the "Goal Distribution by Thrust Area" chart
  Then I see a horizontal bar chart with one bar per thrust area
  And each bar length represents the number of goals in that area
  And I can sort by count (highest to lowest)
```

---

### US-ANL-05: Manager Effectiveness Dashboard

**As an** Admin,
**I want to** compare check-in completion rates across L1 managers,
**so that** I can identify managers who are consistently completing reviews vs those who are lagging.

```gherkin
Scenario: View manager effectiveness chart
  Given multiple managers have teams with active check-ins
  When I navigate to "Analytics" and view the Manager Effectiveness section
  Then I see a bar chart with one bar per L1 manager
  And each bar shows the percentage of check-in reviews completed for the current quarter
  And managers are sorted from highest to lowest completion rate

Scenario: Manager with all reviews complete shown as 100%
  Given Manager Priya Sharma has completed all 8 team reviews
  When I view the Manager Effectiveness chart
  Then Priya Sharma's bar shows 100% (8/8)

Scenario: Chart updates as managers complete reviews
  Given a manager completes a check-in review
  When I view the analytics dashboard (after refresh)
  Then that manager's bar reflects the updated count
```

---

## PART 7 — NON-FUNCTIONAL & CROSS-CUTTING STORIES

---

### US-NFR-01: Server-Side Authorization Enforcement

**As the** system,
**I want to** enforce role-based access on every server action and API route,
**so that** users cannot perform actions beyond their permitted role even by crafting direct requests.

```gherkin
Scenario: Employee cannot call manager approval action
  Given I am signed in as an Employee
  When I send a direct request to the approveGoalSheet server action
  Then the server returns a 403 Forbidden response
  And no data is modified

Scenario: Manager cannot call admin unlock action
  Given I am signed in as a Manager
  When I attempt to call the unlockGoalSheet server action directly
  Then the server returns a 403 Forbidden response

Scenario: API routes enforce role on reads
  Given I am signed in as an Employee
  When I request GET /api/admin/audit-logs directly
  Then the server returns a 403 Forbidden response
  And no audit log data is returned
```

---

### US-NFR-02: All Mutations Validated Server-Side

**As the** system,
**I want to** validate all input with Zod schemas on the server for every mutation,
**so that** business rules cannot be bypassed by disabling client-side validation.

```gherkin
Scenario: Weightage rule enforced server-side
  Given a malicious request submits a goal sheet with total weightage = 95%
  When the server receives the request
  Then Zod validation rejects it
  And the server returns a 400 Bad Request with the specific rule violation
  And no goal sheet is persisted

Scenario: Max goal count enforced server-side
  Given a goal sheet already has 8 goals
  When a request is made to add a 9th goal
  Then the server rejects the request
  And no 9th goal is created in the database
```

---

### US-NFR-03: Meaningful Error Messages

**As a** user,
**I want to** see clear, specific error messages when something goes wrong,
**so that** I know exactly what needs to be corrected without guessing.

```gherkin
Scenario: Inline field errors are specific
  Given I submit a goal form with a goal at 8% weightage
  Then I see the inline error: "Minimum weightage per goal is 10%. This goal is currently at 8%."
  And not a generic "Validation failed" message

Scenario: Server error shown as toast
  Given the server encounters an unexpected error
  When a mutation fails with a 500 error
  Then I see a toast: "Something went wrong. Please try again."
  And the form data is preserved so I do not lose my work
```

---

### US-NFR-04: Audit Trail Integrity

**As the** system,
**I want to** record all significant state changes in the audit log as an append-only record,
**so that** the history is complete and cannot be altered.

```gherkin
Scenario: Audit log captures all post-lock changes
  Given a goal sheet is "Approved / Locked"
  When Admin unlocks it, the employee edits and resubmits, and the manager re-approves
  Then the audit log contains entries for: unlock, submit (second), approve (second)
  And each entry has a timestamp, user, action, old value, and new value

Scenario: Audit log entries cannot be deleted
  Given an audit log entry exists
  When I (as Admin) view the audit log
  Then there is no delete or edit button on any log entry
  And if a DELETE request is made directly to the audit log endpoint
  Then the server returns a 405 Method Not Allowed
```
