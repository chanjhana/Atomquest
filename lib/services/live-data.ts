import { prisma } from "@/lib/prisma";
import type { Quarter } from "@/lib/domain/enums";
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
import {
  demoAuditLogs,
  demoCheckIns,
  demoCycle,
  demoEscalations,
  demoGoalSheets,
  demoSharedGoals,
  demoUsers
} from "./demo-data";
import { computeProgressScore } from "./score-engine";

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  managerId: string | null;
  department: string;
  designation: string;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    managerId: user.managerId,
    department: user.department,
    designation: user.designation
  };
}

function mapCycle(cycle: {
  id: string;
  name: string;
  isActive: boolean;
  goalSettingStart: Date;
  goalSettingEnd: Date;
  q1Start: Date;
  q1End: Date;
  q2Start: Date;
  q2End: Date;
  q3Start: Date;
  q3End: Date;
  q4Start: Date;
  q4End: Date;
}): Cycle {
  return {
    id: cycle.id,
    name: cycle.name,
    isActive: cycle.isActive,
    goalSettingStart: cycle.goalSettingStart.toISOString(),
    goalSettingEnd: cycle.goalSettingEnd.toISOString(),
    q1Start: cycle.q1Start.toISOString(),
    q1End: cycle.q1End.toISOString(),
    q2Start: cycle.q2Start.toISOString(),
    q2End: cycle.q2End.toISOString(),
    q3Start: cycle.q3Start.toISOString(),
    q3End: cycle.q3End.toISOString(),
    q4Start: cycle.q4Start.toISOString(),
    q4End: cycle.q4End.toISOString()
  };
}

function mapGoal(goal: {
  id: string;
  goalSheetId: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: Goal["uomType"];
  scoreDirection: Goal["scoreDirection"];
  target: string;
  weightage: number;
  sortOrder: number;
  status: Goal["status"] | "manager_reviewed";
  isShared: boolean;
  sharedGoalGroupId: string | null;
  sharedGoalLink?: { isPrimaryOwner: boolean } | null;
  sharedGoalGroup?: { createdBy?: { name: string } | null } | null;
}): Goal {
  return {
    id: goal.id,
    goalSheetId: goal.goalSheetId,
    title: goal.title,
    description: goal.description,
    thrustArea: goal.thrustArea,
    uomType: goal.uomType,
    scoreDirection: goal.scoreDirection,
    target: goal.target,
    weightage: goal.weightage,
    sortOrder: goal.sortOrder,
    status: goal.status === "manager_reviewed" ? "completed" : goal.status,
    isShared: goal.isShared,
    isSharedPrimaryOwner: goal.sharedGoalLink?.isPrimaryOwner ?? false,
    sharedGoalGroupId: goal.sharedGoalGroupId,
    assignedBy: goal.sharedGoalGroup?.createdBy?.name ?? null
  };
}

function mapSheet(sheet: {
  id: string;
  userId: string;
  managerId: string;
  cycleId: string;
  status: GoalSheet["status"];
  returnComment: string | null;
  submittedAt: Date | null;
  approvedAt: Date | null;
  goals: Array<Parameters<typeof mapGoal>[0]>;
}): GoalSheet {
  return {
    id: sheet.id,
    userId: sheet.userId,
    managerId: sheet.managerId,
    cycleId: sheet.cycleId,
    status: sheet.status,
    returnComment: sheet.returnComment,
    submittedAt: sheet.submittedAt?.toISOString() ?? null,
    approvedAt: sheet.approvedAt?.toISOString() ?? null,
    goals: sheet.goals.map(mapGoal)
  };
}

function mapCheckIn(checkIn: {
  id: string;
  goalId: string;
  userId: string;
  quarter: CheckIn["quarter"];
  actualValue: string;
  status: "not_started" | "on_track" | "completed" | "manager_reviewed";
  computedScore: number;
  employeeComment: string | null;
  managerComment: string | null;
  managerCheckedIn: boolean;
  employeeSubmittedAt: Date | null;
  managerCheckedInAt: Date | null;
}): CheckIn {
  return {
    id: checkIn.id,
    goalId: checkIn.goalId,
    userId: checkIn.userId,
    quarter: checkIn.quarter,
    actualValue: checkIn.actualValue,
    status: checkIn.status,
    computedScore: checkIn.computedScore,
    employeeComment: checkIn.employeeComment,
    managerComment: checkIn.managerComment,
    managerCheckedIn: checkIn.managerCheckedIn,
    employeeSubmittedAt: checkIn.employeeSubmittedAt?.toISOString() ?? null,
    managerCheckedInAt: checkIn.managerCheckedInAt?.toISOString() ?? null
  };
}

function mapAuditLog(log: {
  id: string;
  action: string;
  target: string;
  fieldChanged: string | null;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
  createdAt: Date;
  user: { id: string; name: string };
}): AuditLog {
  return {
    id: log.id,
    actorId: log.user.id,
    actorName: log.user.name,
    action: log.action,
    target: log.target,
    fieldChanged: log.fieldChanged,
    oldValue: log.oldValue,
    newValue: log.newValue,
    reason: log.reason,
    createdAt: log.createdAt.toISOString()
  };
}

function mapSharedGoal(group: {
  id: string;
  createdByUserId: string;
  primaryOwnerUserId: string;
  cycleId: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: SharedGoalGroup["uomType"];
  scoreDirection: SharedGoalGroup["scoreDirection"];
  target: string;
  links: Array<{ recipientUserId: string }>;
}): SharedGoalGroup {
  return {
    id: group.id,
    createdByUserId: group.createdByUserId,
    primaryOwnerUserId: group.primaryOwnerUserId,
    cycleId: group.cycleId,
    title: group.title,
    description: group.description,
    thrustArea: group.thrustArea,
    uomType: group.uomType,
    scoreDirection: group.scoreDirection,
    target: group.target,
    recipientUserIds: group.links.map((link) => link.recipientUserId)
  };
}

function mapEscalation(item: {
  id: string;
  userId: string;
  ruleType: Escalation["ruleType"];
  escalationLevel: number;
  status: Escalation["status"];
  daysPending: number;
  triggeredAt: Date;
  resolvedAt: Date | null;
  user: { name: string; manager?: { name: string } | null };
}): Escalation {
  return {
    id: item.id,
    userId: item.userId,
    employeeName: item.user.name,
    managerName: item.user.manager?.name ?? "Unassigned",
    ruleType: item.ruleType,
    escalationLevel: Math.min(3, Math.max(1, item.escalationLevel)) as 1 | 2 | 3,
    status: item.status,
    daysPending: item.daysPending,
    triggeredAt: item.triggeredAt.toISOString(),
    resolvedAt: item.resolvedAt?.toISOString() ?? null
  };
}

export async function getActiveCycleData() {
  try {
    const cycle = await prisma.cycle.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });
    return cycle ? mapCycle(cycle) : demoCycle;
  } catch {
    return demoCycle;
  }
}

export async function getUserByIdData(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? mapUser(user) : demoUsers.find((item) => item.id === userId) ?? null;
  } catch {
    return demoUsers.find((item) => item.id === userId) ?? null;
  }
}

export async function getGoalSheetForUserData(userId: string) {
  try {
    const sheet = await prisma.goalSheet.findFirst({
      where: { userId },
      include: {
        goals: {
          orderBy: { sortOrder: "asc" },
          include: {
            sharedGoalLink: true,
            sharedGoalGroup: {
              include: {
                createdBy: true
              }
            }
          }
        }
      }
    });
    return sheet ? mapSheet(sheet) : demoGoalSheets.find((item) => item.userId === userId);
  } catch {
    return demoGoalSheets.find((item) => item.userId === userId);
  }
}

export async function getGoalSheetByIdData(id: string) {
  try {
    const sheet = await prisma.goalSheet.findUnique({
      where: { id },
      include: {
        goals: {
          orderBy: { sortOrder: "asc" },
          include: {
            sharedGoalLink: true,
            sharedGoalGroup: {
              include: {
                createdBy: true
              }
            }
          }
        }
      }
    });
    return sheet ? mapSheet(sheet) : demoGoalSheets.find((item) => item.id === id);
  } catch {
    return demoGoalSheets.find((item) => item.id === id);
  }
}

export async function getPendingApprovalsData(managerId: string) {
  try {
    const sheets = await prisma.goalSheet.findMany({
      where: {
        managerId,
        status: "pending_approval"
      },
      include: {
        user: true,
        goals: {
          orderBy: { sortOrder: "asc" },
          include: {
            sharedGoalLink: true,
            sharedGoalGroup: {
              include: {
                createdBy: true
              }
            }
          }
        }
      },
      orderBy: { submittedAt: "desc" }
    });

    if (sheets.length === 0) {
      return demoGoalSheets
        .filter((item) => item.managerId === managerId && item.status === "pending_approval")
        .map((item) => ({
          ownerName: demoUsers.find((user) => user.id === item.userId)?.name ?? "Unknown",
          sheet: item
        }));
    }

    return sheets.map((sheet) => ({
      ownerName: sheet.user.name,
      sheet: mapSheet(sheet)
    }));
  } catch {
    return demoGoalSheets
      .filter((item) => item.managerId === managerId && item.status === "pending_approval")
      .map((item) => ({
        ownerName: demoUsers.find((user) => user.id === item.userId)?.name ?? "Unknown",
        sheet: item
      }));
  }
}

export async function getTeamMembersData(managerId: string) {
  try {
    const users = await prisma.user.findMany({
      where: { managerId },
      orderBy: { name: "asc" }
    });
    return users.length > 0 ? users.map(mapUser) : demoUsers.filter((item) => item.managerId === managerId);
  } catch {
    return demoUsers.filter((item) => item.managerId === managerId);
  }
}

export async function getAllAssignableUsersData() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "admin" } },
      orderBy: { name: "asc" }
    });
    return users.length > 0 ? users.map(mapUser) : demoUsers.filter((item) => item.role !== "admin");
  } catch {
    return demoUsers.filter((item) => item.role !== "admin");
  }
}

export async function getAuditLogsData() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });
    return logs.length > 0 ? logs.map(mapAuditLog) : demoAuditLogs;
  } catch {
    return demoAuditLogs;
  }
}

export async function getSharedGoalsData() {
  try {
    const groups = await prisma.sharedGoalGroup.findMany({
      include: {
        links: true,
        primaryOwner: true
      },
      orderBy: { createdAt: "desc" }
    });

    if (groups.length === 0) {
      return demoSharedGoals.map((group) => ({
        group,
        primaryOwnerName: demoUsers.find((user) => user.id === group.primaryOwnerUserId)?.name ?? "Primary owner"
      }));
    }

    return groups.map((group) => ({
      group: mapSharedGoal(group),
      primaryOwnerName: group.primaryOwner.name
    }));
  } catch {
    return demoSharedGoals.map((group) => ({
      group,
      primaryOwnerName: demoUsers.find((user) => user.id === group.primaryOwnerUserId)?.name ?? "Primary owner"
    }));
  }
}

export async function getCheckInsForUserData(userId: string, quarter: Quarter = "q1") {
  try {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId, quarter },
      orderBy: { createdAt: "asc" }
    });
    return checkIns.length > 0 ? checkIns.map(mapCheckIn) : demoCheckIns.filter((item) => item.userId === userId && item.quarter === quarter);
  } catch {
    return demoCheckIns.filter((item) => item.userId === userId && item.quarter === quarter);
  }
}

export async function getHistoryRowsData(userId: string) {
  const sheet = await getGoalSheetForUserData(userId);
  if (!sheet) return [];
  const checkIns = await getCheckInsForUserData(userId);
  return checkIns.map((checkIn) => ({
    ...checkIn,
    goalTitle: sheet.goals.find((goal) => goal.id === checkIn.goalId)?.title ?? "Goal"
  }));
}

export async function getTeamCheckInRowsData(managerId: string) {
  try {
    const sheets = await prisma.goalSheet.findMany({
      where: { managerId },
      include: {
        user: true,
        goals: {
          include: {
            checkIns: true
          }
        }
      }
    });

    if (sheets.length === 0) {
      const fallback = demoGoalSheets.filter((sheet) => sheet.managerId === managerId);
      return fallback.map((sheet) => ({
        employee: demoUsers.find((user) => user.id === sheet.userId)!,
        sheet,
        submitted: sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id)),
        reviewed: sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn))
      }));
    }

    return sheets.map((sheet) => ({
      employee: mapUser(sheet.user),
      sheet: mapSheet({
        ...sheet,
        goals: sheet.goals.map((goal) => ({
          ...goal,
          sharedGoalLink: null,
          sharedGoalGroup: null
        }))
      }),
      submitted: sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.employeeSubmittedAt)),
      reviewed: sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.managerCheckedIn))
    }));
  } catch {
    const fallback = demoGoalSheets.filter((sheet) => sheet.managerId === managerId);
    return fallback.map((sheet) => ({
      employee: demoUsers.find((user) => user.id === sheet.userId)!,
      sheet,
      submitted: sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id)),
      reviewed: sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn))
    }));
  }
}

export async function getOrgRowsData() {
  try {
    const users = await prisma.user.findMany({
      include: {
        manager: true
      },
      orderBy: { name: "asc" }
    });
    return users.length > 0
      ? users.map((user) => ({
          ...mapUser(user),
          managerName: user.manager?.name ?? "(Admin)"
        }))
      : demoUsers.map((user) => ({
          ...user,
          managerName: user.managerId ? demoUsers.find((item) => item.id === user.managerId)?.name ?? "Unassigned" : "(Admin)"
        }));
  } catch {
    return demoUsers.map((user) => ({
      ...user,
      managerName: user.managerId ? demoUsers.find((item) => item.id === user.managerId)?.name ?? "Unassigned" : "(Admin)"
    }));
  }
}

export async function getEscalationsData() {
  try {
    const items = await prisma.escalation.findMany({
      include: {
        user: {
          include: {
            manager: true
          }
        }
      },
      orderBy: { triggeredAt: "desc" }
    });
    return items.length > 0 ? items.map(mapEscalation) : demoEscalations;
  } catch {
    return demoEscalations;
  }
}

export async function getLockedGoalSheetsData() {
  return prisma.goalSheet.findMany({
    where: {
      status: "approved_locked"
    },
    include: {
      user: true
    },
    orderBy: {
      approvedAt: "desc"
    }
  });
}

export async function getCompletionDashboardData(managerId?: string) {
  try {
    const sheets = await prisma.goalSheet.findMany({
      where: managerId ? { managerId } : undefined,
      include: {
        goals: {
          include: { checkIns: true }
        }
      }
    });

    const source = sheets.length > 0 ? sheets : null;
    const total = source ? source.length : demoGoalSheets.filter((sheet) => (managerId ? sheet.managerId === managerId : true)).length;
    const approved = source
      ? source.filter((sheet) => sheet.status === "approved_locked").length
      : demoGoalSheets.filter((sheet) => (managerId ? sheet.managerId === managerId : true) && sheet.status === "approved_locked").length;
    const pending = source
      ? source.filter((sheet) => sheet.status === "pending_approval").length
      : demoGoalSheets.filter((sheet) => (managerId ? sheet.managerId === managerId : true) && sheet.status === "pending_approval").length;
    const checkInSubmitted = source
      ? source.filter((sheet) => sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.employeeSubmittedAt))).length
      : demoGoalSheets.filter((sheet) =>
          (managerId ? sheet.managerId === managerId : true) &&
          sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id))
        ).length;
    const managerReviewed = source
      ? source.filter((sheet) => sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.managerCheckedIn))).length
      : demoGoalSheets.filter((sheet) =>
          (managerId ? sheet.managerId === managerId : true) &&
          sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn))
        ).length;

    return {
      total,
      approved,
      pending,
      checkInSubmitted,
      managerReviewed,
      checkInRate: total === 0 ? 0 : Math.round((checkInSubmitted / total) * 100),
      managerReviewRate: total === 0 ? 0 : Math.round((managerReviewed / total) * 100)
    };
  } catch {
    const scoped = demoGoalSheets.filter((sheet) => (managerId ? sheet.managerId === managerId : true));
    const checkInSubmitted = scoped.filter((sheet) =>
      sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id))
    ).length;
    const managerReviewed = scoped.filter((sheet) =>
      sheet.goals.some((goal) => demoCheckIns.some((checkIn) => checkIn.goalId === goal.id && checkIn.managerCheckedIn))
    ).length;
    return {
      total: scoped.length,
      approved: scoped.filter((sheet) => sheet.status === "approved_locked").length,
      pending: scoped.filter((sheet) => sheet.status === "pending_approval").length,
      checkInSubmitted,
      managerReviewed,
      checkInRate: scoped.length === 0 ? 0 : Math.round((checkInSubmitted / scoped.length) * 100),
      managerReviewRate: scoped.length === 0 ? 0 : Math.round((managerReviewed / scoped.length) * 100)
    };
  }
}

export async function getReportRowsData(filters?: { department?: string; quarter?: string }) {
  const quarter = (filters?.quarter ?? "q1") as Quarter;
  const deptFilter = filters?.department && filters.department !== "all" ? filters.department : undefined;

  try {
    const sheets = await prisma.goalSheet.findMany({
      where: deptFilter ? { user: { department: { contains: deptFilter, mode: "insensitive" } } } : undefined,
      include: {
        user: true,
        goals: {
          include: {
            checkIns: {
              where: { quarter },
              take: 1
            }
          }
        }
      }
    });

    if (sheets.length === 0) {
      return demoGoalSheets.flatMap((sheet) => {
        const owner = demoUsers.find((user) => user.id === sheet.userId);
        return sheet.goals.map((goal) => {
          const checkIn = demoCheckIns.find((item) => item.goalId === goal.id && item.quarter === quarter);
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

    return sheets.flatMap((sheet) =>
      sheet.goals.map((goal) => {
        const checkIn = goal.checkIns[0];
        return {
          employeeName: sheet.user.name,
          department: sheet.user.department,
          goalTitle: goal.title,
          thrustArea: goal.thrustArea,
          uom: goal.uomType,
          target: goal.target,
          actual: checkIn?.actualValue ?? "-",
          score: checkIn ? `${Math.round(checkIn.computedScore)}%` : "-",
          status: checkIn?.status ?? sheet.status
        };
      })
    );
  } catch {
    return demoGoalSheets.flatMap((sheet) => {
      const owner = demoUsers.find((user) => user.id === sheet.userId);
      return sheet.goals.map((goal) => {
        const checkIn = demoCheckIns.find((item) => item.goalId === goal.id && item.quarter === quarter);
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
}

export async function getAnalyticsDashboardData() {
  try {
    const goalSheets = await prisma.goalSheet.findMany({
      include: {
        manager: true,
        goals: {
          include: {
            checkIns: true
          }
        }
      }
    });

    if (goalSheets.length === 0) {
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

    const qoqTrend = (["q1", "q2", "q3", "q4"] as const).map((quarter) => {
      const scores = goalSheets.flatMap((sheet) =>
        sheet.goals.flatMap((goal) => goal.checkIns.filter((checkIn) => checkIn.quarter === quarter).map((checkIn) => checkIn.computedScore))
      );
      const avg = scores.length === 0 ? 0 : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
      return { quarter: quarter.toUpperCase(), score: avg };
    });

    const completionRate = (["q1", "q2", "q3", "q4"] as const).map((quarter) => {
      const completed = goalSheets.filter((sheet) =>
        sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.quarter === quarter && checkIn.employeeSubmittedAt))
      ).length;
      return { quarter: quarter.toUpperCase(), completed, total: goalSheets.length };
    });

    const statusCounts = new Map<string, number>();
    const thrustCounts = new Map<string, number>();
    const managerEffectiveness = new Map<string, { reviewed: number; total: number }>();

    goalSheets.forEach((sheet) => {
      const managerName = sheet.manager.name;
      const managerEntry = managerEffectiveness.get(managerName) ?? { reviewed: 0, total: 0 };
      managerEntry.total += 1;
      if (sheet.goals.some((goal) => goal.checkIns.some((checkIn) => checkIn.managerCheckedIn))) {
        managerEntry.reviewed += 1;
      }
      managerEffectiveness.set(managerName, managerEntry);

      sheet.goals.forEach((goal) => {
        thrustCounts.set(goal.thrustArea, (thrustCounts.get(goal.thrustArea) ?? 0) + 1);
        statusCounts.set(goal.status, (statusCounts.get(goal.status) ?? 0) + 1);
      });
    });

    return {
      qoqTrend,
      completionRate,
      statusDistribution: Array.from(statusCounts.entries()).map(([name, value]) => ({ name: name.replaceAll("_", " "), value })),
      thrustAreaDistribution: Array.from(thrustCounts.entries()).map(([name, value]) => ({ name, value })),
      managerEffectiveness: Array.from(managerEffectiveness.entries()).map(([manager, stats]) => ({
        manager,
        rate: stats.total === 0 ? 0 : Math.round((stats.reviewed / stats.total) * 100)
      }))
    };
  } catch {
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
}

export function summarizeSheet(sheet?: GoalSheet | null) {
  if (!sheet) return { totalWeightage: 0, goalCount: 0, status: "draft" as GoalSheet["status"] };
  return {
    totalWeightage: sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0),
    goalCount: sheet.goals.length,
    status: sheet.status
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
