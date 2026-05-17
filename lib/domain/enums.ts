export const roles = ["employee", "manager", "admin"] as const;
export type Role = (typeof roles)[number];

export const goalSheetStatuses = ["draft", "pending_approval", "returned", "approved_locked"] as const;
export type GoalSheetStatus = (typeof goalSheetStatuses)[number];

export const goalStatuses = ["not_started", "on_track", "completed"] as const;
export type GoalStatus = (typeof goalStatuses)[number];

export const quarters = ["q1", "q2", "q3", "q4"] as const;
export type Quarter = (typeof quarters)[number];

export const uomTypes = ["numeric", "percentage", "timeline", "zero"] as const;
export type UomType = (typeof uomTypes)[number];

export const scoreDirections = ["higher_is_better", "lower_is_better"] as const;
export type ScoreDirection = (typeof scoreDirections)[number];

export const escalationStatuses = ["open", "acknowledged", "resolved"] as const;
export type EscalationStatus = (typeof escalationStatuses)[number];

export const escalationRuleTypes = [
  "goal_submission_overdue",
  "manager_approval_overdue",
  "check_in_overdue"
] as const;
export type EscalationRuleType = (typeof escalationRuleTypes)[number];

export const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  returned: "Returned",
  approved_locked: "Locked",
  not_started: "Not Started",
  on_track: "On Track",
  completed: "Completed",
  manager_reviewed: "Manager Reviewed",
  open: "Open",
  acknowledged: "Acknowledged",
  resolved: "Resolved"
};

export const roleLabels: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager",
  admin: "Admin / HR"
};
