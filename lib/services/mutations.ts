import { prisma } from "@/lib/prisma";
import { goalSheetSchema } from "@/lib/validation/goal-sheet";
import { computeProgressScore } from "./score-engine";
import { activeQuarter, isGoalSettingOpen, isQuarterOpen } from "./windows";
import { getActiveCycleData } from "./live-data";
import type { GoalSheetStatus, Quarter } from "@/lib/domain/enums";

type GoalDraftInput = {
  id?: string;
  title: string;
  description: string;
  thrustArea: string;
  uomType: "numeric" | "percentage" | "timeline" | "zero";
  scoreDirection?: "higher_is_better" | "lower_is_better" | null;
  target: string;
  weightage: number;
  sortOrder: number;
  isShared: boolean;
  sharedGoalGroupId?: string | null;
};

type CheckInInput = {
  goalId: string;
  actualValue: string;
  status: "not_started" | "on_track" | "completed";
  employeeComment?: string;
};

export function parseGoalsFormData(formData: FormData): GoalDraftInput[] {
  const goals = new Map<number, Partial<GoalDraftInput>>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^goals\.(\d+)\.(.+)$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as keyof GoalDraftInput;
    const goal = goals.get(index) ?? {};

    if (field === "weightage" || field === "sortOrder") {
      goal[field] = Number(value) as never;
    } else if (field === "isShared") {
      goal[field] = String(value) === "true" as never;
    } else if (field === "scoreDirection") {
      const parsed = String(value);
      goal.scoreDirection = parsed === "higher_is_better" || parsed === "lower_is_better" ? parsed : null;
    } else if (field === "sharedGoalGroupId" || field === "id") {
      goal[field] = (String(value) || null) as never;
    } else {
      goal[field] = String(value) as never;
    }

    goals.set(index, goal);
  }

  return Array.from(goals.entries())
    .sort(([a], [b]) => a - b)
    .map(([, goal], idx) => ({
      id: goal.id || undefined,
      title: goal.title ?? "",
      description: goal.description ?? "",
      thrustArea: goal.thrustArea ?? "",
      uomType: (goal.uomType ?? "numeric") as GoalDraftInput["uomType"],
      scoreDirection: (goal.scoreDirection as GoalDraftInput["scoreDirection"]) ?? null,
      target: goal.target ?? "",
      weightage: Number(goal.weightage ?? 0),
      sortOrder: Number(goal.sortOrder ?? idx + 1),
      isShared: Boolean(goal.isShared),
      sharedGoalGroupId: (goal.sharedGoalGroupId as string | null | undefined) ?? null
    }));
}

export function parseCheckInFormData(formData: FormData): CheckInInput[] {
  const entries = new Map<number, Partial<CheckInInput>>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^entries\.(\d+)\.(.+)$/);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2] as keyof CheckInInput;
    const current = entries.get(index) ?? {};
    current[field] = String(value) as never;
    entries.set(index, current);
  }

  return Array.from(entries.entries())
    .sort(([a], [b]) => a - b)
    .map(([, entry]) => ({
      goalId: entry.goalId ?? "",
      actualValue: entry.actualValue ?? "",
      status: (entry.status ?? "not_started") as CheckInInput["status"],
      employeeComment: entry.employeeComment ?? ""
    }));
}

async function writeAuditLog(input: {
  userId: string;
  goalSheetId?: string;
  goalId?: string;
  action: string;
  target: string;
  fieldChanged?: string;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      goalSheetId: input.goalSheetId,
      goalId: input.goalId,
      action: input.action,
      target: input.target,
      fieldChanged: input.fieldChanged,
      oldValue: input.oldValue,
      newValue: input.newValue,
      reason: input.reason
    }
  });
}

async function upsertGoals(goalSheetId: string, goals: GoalDraftInput[]) {
  const existing = await prisma.goal.findMany({
    where: { goalSheetId }
  });

  for (const goal of goals) {
    const existingGoal = goal.id ? existing.find((item) => item.id === goal.id) : null;
    if (existingGoal) {
      await prisma.goal.update({
        where: { id: existingGoal.id },
        data: {
          title: goal.title,
          description: goal.description,
          thrustArea: goal.thrustArea,
          uomType: goal.uomType,
          scoreDirection: goal.scoreDirection ?? null,
          target: goal.target,
          weightage: goal.weightage,
          sortOrder: goal.sortOrder
        }
      });
    } else {
      await prisma.goal.create({
        data: {
          goalSheetId,
          title: goal.title,
          description: goal.description,
          thrustArea: goal.thrustArea,
          uomType: goal.uomType,
          scoreDirection: goal.scoreDirection ?? null,
          target: goal.target,
          weightage: goal.weightage,
          sortOrder: goal.sortOrder,
          isShared: goal.isShared,
          sharedGoalGroupId: goal.sharedGoalGroupId ?? null
        }
      });
    }
  }
}

export async function saveGoalSheetForEmployee(args: {
  userId: string;
  managerId: string | null;
  sheetId?: string | null;
  goals: GoalDraftInput[];
  submit: boolean;
}) {
  const cycle = await getActiveCycleData();
  if (!isGoalSettingOpen(cycle)) {
    throw new Error("Goal setting window is not currently active.");
  }

  if (!args.managerId) {
    throw new Error("No reporting manager is configured for this employee.");
  }

  if (args.submit) {
    goalSheetSchema.parse({
      goals: args.goals.map((goal) => ({
        title: goal.title,
        description: goal.description,
        thrustArea: goal.thrustArea,
        uomType: goal.uomType,
        scoreDirection: goal.scoreDirection ?? undefined,
        target: goal.target,
        weightage: goal.weightage,
        isShared: goal.isShared
      }))
    });
  }

  const existingSheet = args.sheetId
    ? await prisma.goalSheet.findUnique({
        where: { id: args.sheetId },
        include: {
          goals: true
        }
      })
    : await prisma.goalSheet.findFirst({
        where: {
          userId: args.userId,
          cycleId: cycle.id
        },
        include: {
          goals: true
        }
      });

  if (existingSheet && existingSheet.status === "approved_locked") {
    throw new Error("Locked goal sheets cannot be edited.");
  }

  const status: GoalSheetStatus = args.submit ? "pending_approval" : "draft";

  if (existingSheet) {
    await prisma.goalSheet.update({
      where: { id: existingSheet.id },
      data: {
        status,
        returnComment: null,
        submittedAt: args.submit ? new Date() : existingSheet.submittedAt
      }
    });
    await upsertGoals(existingSheet.id, args.goals);
    await writeAuditLog({
      userId: args.userId,
      goalSheetId: existingSheet.id,
      action: args.submit ? "submit" : "save_draft",
      target: "Goal Sheet",
      oldValue: existingSheet.status,
      newValue: status
    });
    return existingSheet.id;
  }

  const created = await prisma.goalSheet.create({
    data: {
      userId: args.userId,
      managerId: args.managerId,
      cycleId: cycle.id,
      status,
      submittedAt: args.submit ? new Date() : null,
      goals: {
        create: args.goals.map((goal) => ({
          title: goal.title,
          description: goal.description,
          thrustArea: goal.thrustArea,
          uomType: goal.uomType,
          scoreDirection: goal.scoreDirection ?? null,
          target: goal.target,
          weightage: goal.weightage,
          sortOrder: goal.sortOrder,
          isShared: goal.isShared,
          sharedGoalGroupId: goal.sharedGoalGroupId ?? null
        }))
      }
    }
  });

  await writeAuditLog({
    userId: args.userId,
    goalSheetId: created.id,
    action: args.submit ? "submit" : "save_draft",
    target: "Goal Sheet",
    newValue: status
  });

  return created.id;
}

export async function withdrawGoalSheetForEmployee(args: {
  userId: string;
  sheetId: string;
}) {
  const sheet = await prisma.goalSheet.findUnique({
    where: { id: args.sheetId }
  });

  if (!sheet || sheet.userId !== args.userId) {
    throw new Error("Goal sheet not found.");
  }

  if (sheet.status !== "pending_approval") {
    throw new Error("Only pending goal sheets can be withdrawn.");
  }

  await prisma.goalSheet.update({
    where: { id: sheet.id },
    data: {
      status: "draft",
      submittedAt: null
    }
  });

  await writeAuditLog({
    userId: args.userId,
    goalSheetId: sheet.id,
    action: "withdraw",
    target: "Goal Sheet",
    oldValue: "pending_approval",
    newValue: "draft"
  });
}

export async function approveGoalSheetForManager(args: {
  managerId: string;
  sheetId: string;
  goals: GoalDraftInput[];
}) {
  const sheet = await prisma.goalSheet.findUnique({
    where: { id: args.sheetId },
    include: { goals: true }
  });

  if (!sheet || sheet.managerId !== args.managerId) {
    throw new Error("Goal sheet not found.");
  }

  if (sheet.status !== "pending_approval") {
    throw new Error("Only pending sheets can be approved.");
  }

  goalSheetSchema.parse({
    goals: args.goals.map((goal) => ({
      title: goal.title,
      description: goal.description,
      thrustArea: goal.thrustArea,
      uomType: goal.uomType,
      scoreDirection: goal.scoreDirection ?? undefined,
      target: goal.target,
      weightage: goal.weightage,
      isShared: goal.isShared
    }))
  });

  for (const goal of args.goals) {
    const original = sheet.goals.find((item) => item.id === goal.id);
    if (!original) continue;
    if (original.isShared && original.target !== goal.target) {
      throw new Error("Shared goal targets are read-only during approval.");
    }

    if (original.target !== goal.target) {
      await writeAuditLog({
        userId: args.managerId,
        goalSheetId: sheet.id,
        goalId: original.id,
        action: "manager_edit",
        target: original.title,
        fieldChanged: "target",
        oldValue: original.target,
        newValue: goal.target
      });
    }

    if (original.weightage !== goal.weightage) {
      await writeAuditLog({
        userId: args.managerId,
        goalSheetId: sheet.id,
        goalId: original.id,
        action: "manager_edit",
        target: original.title,
        fieldChanged: "weightage",
        oldValue: String(original.weightage),
        newValue: String(goal.weightage)
      });
    }
  }

  await upsertGoals(sheet.id, args.goals);
  await prisma.goalSheet.update({
    where: { id: sheet.id },
    data: {
      status: "approved_locked",
      approvedAt: new Date(),
      returnComment: null
    }
  });

  await writeAuditLog({
    userId: args.managerId,
    goalSheetId: sheet.id,
    action: "approve",
    target: "Goal Sheet",
    oldValue: "pending_approval",
    newValue: "approved_locked"
  });
}

export async function returnGoalSheetForManager(args: {
  managerId: string;
  sheetId: string;
  comment: string;
}) {
  if (!args.comment.trim()) {
    throw new Error("A rework comment is required before returning.");
  }

  const sheet = await prisma.goalSheet.findUnique({
    where: { id: args.sheetId }
  });

  if (!sheet || sheet.managerId !== args.managerId) {
    throw new Error("Goal sheet not found.");
  }

  await prisma.goalSheet.update({
    where: { id: sheet.id },
    data: {
      status: "returned",
      returnComment: args.comment,
      submittedAt: null
    }
  });

  await writeAuditLog({
    userId: args.managerId,
    goalSheetId: sheet.id,
    action: "return",
    target: "Goal Sheet",
    oldValue: sheet.status,
    newValue: "returned",
    reason: args.comment
  });
}

export async function unlockGoalSheetForAdmin(args: {
  adminId: string;
  sheetId: string;
  reason: string;
}) {
  if (!args.reason.trim()) {
    throw new Error("A reason is required to unlock a goal sheet.");
  }

  const sheet = await prisma.goalSheet.findUnique({
    where: { id: args.sheetId }
  });

  if (!sheet) {
    throw new Error("Goal sheet not found.");
  }

  await prisma.goalSheet.update({
    where: { id: sheet.id },
    data: {
      status: "draft",
      approvedAt: null
    }
  });

  await writeAuditLog({
    userId: args.adminId,
    goalSheetId: sheet.id,
    action: "unlock",
    target: "Goal Sheet",
    oldValue: sheet.status,
    newValue: "draft",
    reason: args.reason
  });
}

export async function saveQuarterlyCheckIn(args: {
  userId: string;
  quarter?: Quarter;
  entries: CheckInInput[];
  submit: boolean;
}) {
  const cycle = await getActiveCycleData();
  const quarter = args.quarter ?? activeQuarter(cycle);
  if (!isQuarterOpen(cycle, quarter)) {
    throw new Error(`The ${quarter.toUpperCase()} check-in window is not active.`);
  }

  const sheet = await prisma.goalSheet.findFirst({
    where: {
      userId: args.userId,
      cycleId: cycle.id,
      status: "approved_locked"
    },
    include: {
      goals: {
        include: {
          sharedGoalLink: true
        }
      }
    }
  });

  if (!sheet) {
    throw new Error("No approved goal sheet found for the active cycle.");
  }

  const now = new Date();

  for (const entry of args.entries) {
    const goal = sheet.goals.find((item) => item.id === entry.goalId);
    if (!goal) continue;

    const computedScore = computeProgressScore({
      actualValue: entry.actualValue,
      target: goal.target,
      uomType: goal.uomType,
      scoreDirection: goal.scoreDirection
    });

    await prisma.checkIn.upsert({
      where: {
        goalId_quarter: {
          goalId: goal.id,
          quarter
        }
      },
      update: {
        actualValue: entry.actualValue,
        status: entry.status,
        computedScore,
        employeeComment: entry.employeeComment ?? null,
        employeeSubmittedAt: args.submit ? now : undefined
      },
      create: {
        goalId: goal.id,
        userId: args.userId,
        quarter,
        actualValue: entry.actualValue,
        status: entry.status,
        computedScore,
        employeeComment: entry.employeeComment ?? null,
        employeeSubmittedAt: args.submit ? now : null
      }
    });

    if (goal.sharedGoalLink?.isPrimaryOwner && goal.sharedGoalGroupId) {
      const linkedGoals = await prisma.sharedGoalLink.findMany({
        where: {
          sharedGoalGroupId: goal.sharedGoalGroupId,
          isPrimaryOwner: false
        },
        include: {
          goal: true
        }
      });

      for (const linked of linkedGoals) {
        const linkedScore = computeProgressScore({
          actualValue: entry.actualValue,
          target: linked.goal.target,
          uomType: linked.goal.uomType,
          scoreDirection: linked.goal.scoreDirection
        });

        await prisma.checkIn.upsert({
          where: {
            goalId_quarter: {
              goalId: linked.goalId,
              quarter
            }
          },
          update: {
            actualValue: entry.actualValue,
            computedScore: linkedScore
          },
          create: {
            goalId: linked.goalId,
            userId: linked.recipientUserId,
            quarter,
            actualValue: entry.actualValue,
            status: entry.status,
            computedScore: linkedScore
          }
        });
      }

      await writeAuditLog({
        userId: args.userId,
        goalSheetId: sheet.id,
        goalId: goal.id,
        action: "shared_goal_sync",
        target: goal.title,
        newValue: entry.actualValue
      });
    }
  }

  await writeAuditLog({
    userId: args.userId,
    goalSheetId: sheet.id,
    action: args.submit ? "submit_checkin" : "save_checkin",
    target: `${quarter.toUpperCase()} Check-in`
  });
}

export async function completeManagerReview(args: {
  managerId: string;
  employeeId: string;
  comment: string;
  quarter?: Quarter;
}) {
  if (!args.comment.trim()) {
    throw new Error("A check-in comment is required before completing the review.");
  }

  const cycle = await getActiveCycleData();
  const quarter = args.quarter ?? activeQuarter(cycle);
  const sheet = await prisma.goalSheet.findFirst({
    where: {
      userId: args.employeeId,
      managerId: args.managerId,
      cycleId: cycle.id
    },
    include: {
      goals: true
    }
  });

  if (!sheet) {
    throw new Error("Employee goal sheet not found.");
  }

  const goalIds = sheet.goals.map((goal) => goal.id);
  await prisma.checkIn.updateMany({
    where: {
      goalId: { in: goalIds },
      quarter
    },
    data: {
      managerCheckedIn: true,
      managerCheckedInAt: new Date(),
      managerComment: args.comment,
      status: "manager_reviewed"
    }
  });

  await writeAuditLog({
    userId: args.managerId,
    goalSheetId: sheet.id,
    action: "manager_review_complete",
    target: `${quarter.toUpperCase()} Check-in`,
    reason: args.comment
  });
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

export async function pushSharedGoalForManager(args: {
  createdByUserId: string;
  primaryOwnerUserId: string;
  recipientUserIds: string[];
  title: string;
  description: string;
  thrustArea: string;
  uomType: "numeric" | "percentage" | "timeline" | "zero";
  scoreDirection?: "higher_is_better" | "lower_is_better" | null;
  target: string;
}) {
  if (!args.title.trim()) throw new Error("Goal title is required.");
  if (!args.thrustArea.trim()) throw new Error("Thrust area is required.");
  if (!args.target.trim()) throw new Error("Target is required.");
  if (!args.primaryOwnerUserId) throw new Error("Primary owner is required.");
  if (args.recipientUserIds.length === 0) throw new Error("Select at least one recipient.");
  if (!args.recipientUserIds.includes(args.primaryOwnerUserId)) {
    throw new Error("Primary owner must be included in recipients.");
  }

  const cycle = await getActiveCycleData();

  const group = await prisma.sharedGoalGroup.create({
    data: {
      createdByUserId: args.createdByUserId,
      primaryOwnerUserId: args.primaryOwnerUserId,
      cycleId: cycle.id,
      title: args.title,
      description: args.description,
      thrustArea: args.thrustArea,
      uomType: args.uomType,
      scoreDirection: args.scoreDirection ?? null,
      target: args.target
    }
  });

  const skipped: string[] = [];

  for (const recipientUserId of args.recipientUserIds) {
    const isPrimary = recipientUserId === args.primaryOwnerUserId;

    const recipient = await prisma.user.findUnique({ where: { id: recipientUserId } });
    if (!recipient) continue;

    let sheet = await prisma.goalSheet.findFirst({
      where: { userId: recipientUserId, cycleId: cycle.id }
    });

    if (sheet?.status === "approved_locked") {
      skipped.push(recipientUserId);
      continue;
    }

    if (!sheet) {
      const managerId = recipient.managerId ?? args.createdByUserId;
      sheet = await prisma.goalSheet.create({
        data: {
          userId: recipientUserId,
          managerId,
          cycleId: cycle.id,
          status: "draft"
        }
      });
    }

    const sortOrder = (await prisma.goal.count({ where: { goalSheetId: sheet.id } })) + 1;
    const goal = await prisma.goal.create({
      data: {
        goalSheetId: sheet.id,
        title: args.title,
        description: args.description,
        thrustArea: args.thrustArea,
        uomType: args.uomType,
        scoreDirection: args.scoreDirection ?? null,
        target: args.target,
        weightage: 20,
        sortOrder,
        isShared: true,
        sharedGoalGroupId: group.id
      }
    });

    await prisma.sharedGoalLink.create({
      data: {
        sharedGoalGroupId: group.id,
        goalId: goal.id,
        recipientUserId,
        isPrimaryOwner: isPrimary
      }
    });
  }

  await writeAuditLog({
    userId: args.createdByUserId,
    action: "push_shared_goal",
    target: args.title,
    newValue: `Assigned to ${args.recipientUserIds.length - skipped.length} recipient(s)`
  });

  return { groupId: group.id, skipped };
}

export async function saveCycleForAdmin(args: {
  adminId: string;
  cycleId?: string | null;
  name: string;
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
}) {
  await prisma.cycle.updateMany({ data: { isActive: false } });

  const data = {
    name: args.name,
    isActive: true as const,
    goalSettingStart: args.goalSettingStart,
    goalSettingEnd: args.goalSettingEnd,
    q1Start: args.q1Start,
    q1End: args.q1End,
    q2Start: args.q2Start,
    q2End: args.q2End,
    q3Start: args.q3Start,
    q3End: args.q3End,
    q4Start: args.q4Start,
    q4End: args.q4End
  };

  let cycleId: string;
  if (args.cycleId) {
    const existing = await prisma.cycle.findUnique({ where: { id: args.cycleId } });
    if (existing) {
      await prisma.cycle.update({ where: { id: args.cycleId }, data });
      cycleId = args.cycleId;
    } else {
      const created = await prisma.cycle.create({ data });
      cycleId = created.id;
    }
  } else {
    const created = await prisma.cycle.create({ data });
    cycleId = created.id;
  }

  await writeAuditLog({
    userId: args.adminId,
    action: "activate_cycle",
    target: args.name,
    newValue: cycleId
  });
}

export async function updateUserManagerForAdmin(args: {
  adminId: string;
  targetUserId: string;
  newManagerId: string | null;
}) {
  if (!args.targetUserId) throw new Error("User is required.");

  const target = await prisma.user.findUnique({ where: { id: args.targetUserId } });
  if (!target) throw new Error("User not found.");

  await prisma.user.update({
    where: { id: args.targetUserId },
    data: { managerId: args.newManagerId }
  });

  await writeAuditLog({
    userId: args.adminId,
    action: "update_reporting_line",
    target: target.name,
    newValue: args.newManagerId ?? "(none)"
  });
}

export async function resolveEscalationForAdmin(args: {
  adminId: string;
  escalationId: string;
}) {
  const escalation = await prisma.escalation.findUnique({
    where: { id: args.escalationId }
  });

  if (!escalation) throw new Error("Escalation not found.");
  if (escalation.status === "resolved") throw new Error("Escalation is already resolved.");

  await prisma.escalation.update({
    where: { id: escalation.id },
    data: { status: "resolved", resolvedAt: new Date() }
  });

  await writeAuditLog({
    userId: args.adminId,
    action: "resolve_escalation",
    target: escalation.ruleType,
    oldValue: escalation.status,
    newValue: "resolved"
  });
}
