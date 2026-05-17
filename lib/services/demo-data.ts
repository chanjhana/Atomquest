import type {
  AuditLog,
  CheckIn,
  Cycle,
  Escalation,
  Goal,
  GoalSheet,
  SharedGoalGroup,
  User
} from "@/lib/domain/types";

export const demoUsers: User[] = [
  {
    id: "admin-1",
    name: "Ravi Patel",
    email: "admin@demo.com",
    role: "admin",
    department: "HR",
    designation: "HR Admin"
  },
  {
    id: "manager-1",
    name: "Priya Sharma",
    email: "manager@demo.com",
    role: "manager",
    managerId: "admin-1",
    department: "Engineering",
    designation: "Engineering Manager"
  },
  {
    id: "employee-1",
    name: "Arun Kumar",
    email: "employee@demo.com",
    role: "employee",
    managerId: "manager-1",
    department: "Engineering",
    designation: "Product Engineer"
  },
  {
    id: "employee-2",
    name: "Meena Iyer",
    email: "meena@demo.com",
    role: "employee",
    managerId: "manager-1",
    department: "Engineering",
    designation: "QA Engineer"
  },
  {
    id: "employee-3",
    name: "Kiran S.",
    email: "kiran@demo.com",
    role: "employee",
    managerId: "manager-1",
    department: "Engineering",
    designation: "Data Analyst"
  }
];

export const demoCycle: Cycle = {
  id: "cycle-2026",
  name: "FY 2026-27",
  isActive: true,
  goalSettingStart: "2026-05-01",
  goalSettingEnd: "2026-05-31",
  q1Start: "2026-07-01",
  q1End: "2026-07-31",
  q2Start: "2026-10-01",
  q2End: "2026-10-31",
  q3Start: "2027-01-01",
  q3End: "2027-01-31",
  q4Start: "2027-03-01",
  q4End: "2027-04-30"
};

const arunGoals: Goal[] = [
  {
    id: "goal-1",
    goalSheetId: "sheet-1",
    title: "Improve platform reliability",
    description: "Reduce production incidents through proactive fixes.",
    thrustArea: "Operational Excellence",
    uomType: "numeric",
    scoreDirection: "lower_is_better",
    target: "5",
    weightage: 35,
    sortOrder: 1,
    status: "on_track",
    isShared: false
  },
  {
    id: "goal-2",
    goalSheetId: "sheet-1",
    title: "Increase automation coverage",
    description: "Automate regression coverage for critical modules.",
    thrustArea: "Engineering Productivity",
    uomType: "percentage",
    scoreDirection: "higher_is_better",
    target: "80",
    weightage: 40,
    sortOrder: 2,
    status: "on_track",
    isShared: false
  },
  {
    id: "goal-3",
    goalSheetId: "sheet-1",
    title: "Cost per Acquisition",
    description: "Reduce departmental cost per acquisition for growth programs.",
    thrustArea: "Cost Optimization",
    uomType: "numeric",
    scoreDirection: "lower_is_better",
    target: "10",
    weightage: 25,
    sortOrder: 3,
    status: "on_track",
    isShared: true,
    isSharedPrimaryOwner: true,
    sharedGoalGroupId: "shared-1",
    assignedBy: "Priya Sharma"
  }
];

const meenaGoals: Goal[] = [
  {
    id: "goal-4",
    goalSheetId: "sheet-2",
    title: "Cost per Acquisition",
    description: "Reduce departmental cost per acquisition for growth programs.",
    thrustArea: "Cost Optimization",
    uomType: "numeric",
    scoreDirection: "lower_is_better",
    target: "10",
    weightage: 20,
    sortOrder: 1,
    status: "on_track",
    isShared: true,
    isSharedPrimaryOwner: false,
    sharedGoalGroupId: "shared-1",
    assignedBy: "Priya Sharma"
  },
  {
    id: "goal-5",
    goalSheetId: "sheet-2",
    title: "Improve QA cycle predictability",
    description: "Complete regression cycles within committed timelines.",
    thrustArea: "Operational Excellence",
    uomType: "timeline",
    target: "2026-07-25",
    weightage: 80,
    sortOrder: 2,
    status: "completed",
    isShared: false
  }
];

export const demoGoalSheets: GoalSheet[] = [
  {
    id: "sheet-1",
    userId: "employee-1",
    managerId: "manager-1",
    cycleId: demoCycle.id,
    status: "pending_approval",
    submittedAt: "2026-05-12",
    goals: arunGoals
  },
  {
    id: "sheet-2",
    userId: "employee-2",
    managerId: "manager-1",
    cycleId: demoCycle.id,
    status: "approved_locked",
    submittedAt: "2026-05-08",
    approvedAt: "2026-05-10",
    goals: meenaGoals
  },
  {
    id: "sheet-3",
    userId: "employee-3",
    managerId: "manager-1",
    cycleId: demoCycle.id,
    status: "draft",
    goals: []
  }
];

export const demoSharedGoals: SharedGoalGroup[] = [
  {
    id: "shared-1",
    createdByUserId: "manager-1",
    primaryOwnerUserId: "employee-1",
    cycleId: demoCycle.id,
    title: "Cost per Acquisition",
    description: "Reduce departmental cost per acquisition for growth programs.",
    thrustArea: "Cost Optimization",
    uomType: "numeric",
    scoreDirection: "lower_is_better",
    target: "10",
    recipientUserIds: ["employee-1", "employee-2"]
  }
];

export const demoCheckIns: CheckIn[] = [
  {
    id: "check-1",
    goalId: "goal-1",
    userId: "employee-1",
    quarter: "q1",
    actualValue: "6",
    status: "on_track",
    computedScore: 83,
    employeeComment: "Incident trend is improving after alert cleanup.",
    managerCheckedIn: false,
    employeeSubmittedAt: "2026-07-22"
  },
  {
    id: "check-2",
    goalId: "goal-2",
    userId: "employee-1",
    quarter: "q1",
    actualValue: "62",
    status: "on_track",
    computedScore: 78,
    employeeComment: "Core API tests are now automated.",
    managerCheckedIn: false,
    employeeSubmittedAt: "2026-07-22"
  },
  {
    id: "check-3",
    goalId: "goal-3",
    userId: "employee-1",
    quarter: "q1",
    actualValue: "11.2",
    status: "on_track",
    computedScore: 89,
    employeeComment: "Primary owner update for shared KPI.",
    managerCheckedIn: false,
    employeeSubmittedAt: "2026-07-22"
  },
  {
    id: "check-4",
    goalId: "goal-4",
    userId: "employee-2",
    quarter: "q1",
    actualValue: "11.2",
    status: "on_track",
    computedScore: 89,
    employeeComment: "Synced from primary owner Arun Kumar.",
    managerComment: "Good collaboration on shared KPI.",
    managerCheckedIn: true,
    employeeSubmittedAt: "2026-07-22",
    managerCheckedInAt: "2026-07-25"
  }
];

export const demoAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    actorId: "employee-1",
    actorName: "Arun Kumar",
    action: "submit",
    target: "Goal Sheet",
    oldValue: "draft",
    newValue: "pending_approval",
    createdAt: "2026-05-12T10:30:00+05:30"
  },
  {
    id: "audit-2",
    actorId: "manager-1",
    actorName: "Priya Sharma",
    action: "shared_goal_create",
    target: "Cost per Acquisition",
    newValue: "Assigned to Arun Kumar, Meena Iyer",
    createdAt: "2026-05-09T16:00:00+05:30"
  },
  {
    id: "audit-3",
    actorId: "admin-1",
    actorName: "Ravi Patel",
    action: "unlock",
    target: "Meena Iyer Goal Sheet",
    reason: "Leadership changed the thrust area for Q1.",
    createdAt: "2026-05-18T11:15:00+05:30"
  }
];

export const demoEscalations: Escalation[] = [
  {
    id: "esc-1",
    userId: "employee-3",
    employeeName: "Kiran S.",
    managerName: "Priya Sharma",
    ruleType: "goal_submission_overdue",
    escalationLevel: 2,
    status: "open",
    daysPending: 7,
    triggeredAt: "2026-05-08T09:00:00+05:30"
  },
  {
    id: "esc-2",
    userId: "employee-1",
    employeeName: "Arun Kumar",
    managerName: "Priya Sharma",
    ruleType: "manager_approval_overdue",
    escalationLevel: 1,
    status: "acknowledged",
    daysPending: 4,
    triggeredAt: "2026-05-16T09:00:00+05:30"
  }
];
