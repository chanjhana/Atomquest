import {
  demoAuditLogs,
  demoCheckIns,
  demoCycle,
  demoEscalations,
  demoGoalSheets,
  demoSharedGoals,
  demoUsers
} from "./demo-data";
import type { GoalSheetStatus, Quarter, Role } from "@/lib/domain/enums";
import type { CheckIn, Goal, GoalSheet, User } from "@/lib/domain/types";
import { computeProgressScore } from "./score-engine";

export function getUserByRole(role: Role) {
  return demoUsers.find((user) => user.role === role) ?? demoUsers[0];
}

export function getUserById(id: string) {
  return demoUsers.find((user) => user.id === id);
}

export function getActiveCycle() {
  return demoCycle;
}

export function getGoalSheetForUser(userId: string) {
  return demoGoalSheets.find((sheet) => sheet.userId === userId);
}

export function getGoalSheetById(id: string) {
  return demoGoalSheets.find((sheet) => sheet.id === id);
}

export function getTeamMembers(managerId: string) {
  return demoUsers.filter((user) => user.managerId === managerId);
}

export function getPendingApprovals(managerId: string) {
  return demoGoalSheets.filter((sheet) => sheet.managerId === managerId && sheet.status === "pending_approval");
}

export function getGoalOwner(sheet: GoalSheet) {
  return getUserById(sheet.userId);
}

export function getManager(sheet: GoalSheet) {
  return getUserById(sheet.managerId);
}

export function getTeamGoalSheets(managerId: string) {
  return demoGoalSheets.filter((sheet) => sheet.managerId === managerId);
}

export function getAuditLogs() {
  return demoAuditLogs;
}

export function getSharedGoals() {
  return demoSharedGoals;
}

export function getEscalations() {
  return demoEscalations;
}

export function getCheckInsForUser(userId: string, quarter: Quarter = "q1") {
  return demoCheckIns.filter((checkIn) => checkIn.userId === userId && checkIn.quarter === quarter);
}

export function getCheckInsForGoal(goalId: string) {
  return demoCheckIns.filter((checkIn) => checkIn.goalId === goalId);
}

export function getReportRows() {
  return demoGoalSheets.flatMap((sheet) => {
    const owner = getGoalOwner(sheet);
    return sheet.goals.map((goal) => {
      const checkIn = demoCheckIns.find((item) => item.goalId === goal.id && item.quarter === "q1");
      return {
        employeeName: owner?.name ?? "Unknown",
        department: owner?.department ?? "Unknown",
        goalTitle: goal.title,
        thrustArea: goal.thrustArea,
        uom: goal.uomType,
        target: goal.target,
        actual: checkIn?.actualValue ?? "-",
        score: checkIn ? `${Math.round(checkIn.computedScore)}%` : "-",
        status: checkIn?.status ?? sheet.status
      };
    });
  });
}

export function getCompletionSummary(managerId?: string) {
  const sheets = managerId ? getTeamGoalSheets(managerId) : demoGoalSheets;
  const approved = sheets.filter((sheet) => sheet.status === "approved_locked").length;
  const pending = sheets.filter((sheet) => sheet.status === "pending_approval").length;
  const checkInSubmitted = sheets.filter((sheet) =>
    sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id))
  ).length;
  const managerReviewed = sheets.filter((sheet) =>
    sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn))
  ).length;

  return {
    total: sheets.length,
    approved,
    pending,
    checkInSubmitted,
    managerReviewed
  };
}

export function getAnalytics() {
  return {
    qoqTrend: [
      { quarter: "Q1", score: 84 },
      { quarter: "Q2", score: 88 },
      { quarter: "Q3", score: 91 },
      { quarter: "Q4", score: 0 }
    ],
    completionRate: [
      { quarter: "Q1", completed: 2, total: 3 },
      { quarter: "Q2", completed: 1, total: 3 },
      { quarter: "Q3", completed: 0, total: 3 }
    ],
    statusDistribution: [
      { name: "On Track", value: 3 },
      { name: "Completed", value: 1 },
      { name: "Not Started", value: 1 }
    ],
    thrustAreaDistribution: [
      { name: "Operational Excellence", value: 2 },
      { name: "Engineering Productivity", value: 1 },
      { name: "Cost Optimization", value: 2 }
    ],
    managerEffectiveness: [
      { manager: "Priya Sharma", rate: 67 },
      { manager: "Ravi Patel", rate: 100 }
    ]
  };
}

export function previewScore(goal: Goal, actualValue: string) {
  return computeProgressScore({
    actualValue,
    target: goal.target,
    uomType: goal.uomType,
    scoreDirection: goal.scoreDirection
  });
}

export function summarizeSheet(sheet?: GoalSheet) {
  if (!sheet) return { totalWeightage: 0, goalCount: 0, status: "draft" as GoalSheetStatus };
  return {
    totalWeightage: sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0),
    goalCount: sheet.goals.length,
    status: sheet.status
  };
}

export function getOrgRows() {
  return demoUsers.map((user) => ({
    ...user,
    managerName: user.managerId ? getUserById(user.managerId)?.name ?? "Unassigned" : "(Admin)"
  }));
}

export function getTeamCheckInRows(managerId: string) {
  return getTeamGoalSheets(managerId).map((sheet) => {
    const owner = getGoalOwner(sheet) as User;
    const submitted = sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id));
    const reviewed = sheet.goals.some((goal) =>
      demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn)
    );
    return {
      employee: owner,
      sheet,
      submitted,
      reviewed
    };
  });
}

export function getHistoryRows(userId: string) {
  const sheet = getGoalSheetForUser(userId);
  if (!sheet) return [] as Array<CheckIn & { goalTitle: string }>;
  return demoCheckIns
    .filter((checkIn) => sheet.goals.some((goal) => goal.id === checkIn.goalId))
    .map((checkIn) => ({
      ...checkIn,
      goalTitle: sheet.goals.find((goal) => goal.id === checkIn.goalId)?.title ?? "Goal"
    }));
}
