import type {
  EscalationRuleType,
  EscalationStatus,
  GoalSheetStatus,
  GoalStatus,
  Quarter,
  Role,
  ScoreDirection,
  UomType
} from "./enums";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string | null;
  department: string;
  designation: string;
};

export type Cycle = {
  id: string;
  name: string;
  isActive: boolean;
  goalSettingStart: string;
  goalSettingEnd: string;
  q1Start: string;
  q1End: string;
  q2Start: string;
  q2End: string;
  q3Start: string;
  q3End: string;
  q4Start: string;
  q4End: string;
};

export type Goal = {
  id: string;
  goalSheetId: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: UomType;
  scoreDirection?: ScoreDirection | null;
  target: string;
  weightage: number;
  sortOrder: number;
  status: GoalStatus;
  isShared: boolean;
  isSharedPrimaryOwner?: boolean;
  sharedGoalGroupId?: string | null;
  assignedBy?: string | null;
};

export type GoalSheet = {
  id: string;
  userId: string;
  managerId: string;
  cycleId: string;
  status: GoalSheetStatus;
  returnComment?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  goals: Goal[];
};

export type SharedGoalGroup = {
  id: string;
  createdByUserId: string;
  primaryOwnerUserId: string;
  cycleId: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: UomType;
  scoreDirection?: ScoreDirection | null;
  target: string;
  recipientUserIds: string[];
};

export type CheckIn = {
  id: string;
  goalId: string;
  userId: string;
  quarter: Quarter;
  actualValue: string;
  status: GoalStatus | "manager_reviewed";
  computedScore: number;
  employeeComment?: string | null;
  managerComment?: string | null;
  managerCheckedIn: boolean;
  employeeSubmittedAt?: string | null;
  managerCheckedInAt?: string | null;
};

export type AuditLog = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  fieldChanged?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
  createdAt: string;
};

export type Escalation = {
  id: string;
  userId: string;
  employeeName: string;
  managerName: string;
  ruleType: EscalationRuleType;
  escalationLevel: 1 | 2 | 3;
  status: EscalationStatus;
  daysPending: number;
  triggeredAt: string;
  resolvedAt?: string | null;
};
