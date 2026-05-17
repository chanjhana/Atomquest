import { prisma } from "@/lib/prisma";

const SUBMISSION_THRESHOLD_DAYS = 5;
const APPROVAL_THRESHOLD_DAYS = 5;
const LEVEL_ADVANCE_DAYS = 3;

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export async function runEscalationCheck() {
  let created = 0;
  let advanced = 0;

  const cycle = await prisma.cycle.findFirst({ where: { isActive: true } });
  if (!cycle) return { created: 0, advanced: 0, total: 0 };

  const now = new Date();
  const goalSettingOpenDays = daysSince(cycle.goalSettingStart);

  // Rule 1: Employee has not submitted goals within N days of cycle open
  if (now >= cycle.goalSettingStart && now <= cycle.goalSettingEnd && goalSettingOpenDays > SUBMISSION_THRESHOLD_DAYS) {
    const employees = await prisma.user.findMany({ where: { role: "employee" } });
    for (const emp of employees) {
      const sheet = await prisma.goalSheet.findFirst({
        where: { userId: emp.id, cycleId: cycle.id }
      });
      const submitted = sheet && sheet.status !== "draft";
      if (!submitted) {
        const existing = await prisma.escalation.findFirst({
          where: { userId: emp.id, ruleType: "goal_submission_overdue", status: { not: "resolved" } }
        });
        if (!existing) {
          await prisma.escalation.create({
            data: {
              userId: emp.id,
              goalSheetId: sheet?.id ?? null,
              ruleType: "goal_submission_overdue",
              escalationLevel: 1,
              status: "open",
              daysPending: goalSettingOpenDays
            }
          });
          created++;
        } else if (existing.escalationLevel < 3 && daysSince(existing.triggeredAt) >= LEVEL_ADVANCE_DAYS) {
          await prisma.escalation.update({
            where: { id: existing.id },
            data: { escalationLevel: existing.escalationLevel + 1, daysPending: goalSettingOpenDays }
          });
          advanced++;
        }
      }
    }
  }

  // Rule 2: Manager has not approved goals within N days of submission
  const pendingSheets = await prisma.goalSheet.findMany({
    where: { cycleId: cycle.id, status: "pending_approval", submittedAt: { not: null } }
  });
  for (const sheet of pendingSheets) {
    const daysPending = sheet.submittedAt ? daysSince(sheet.submittedAt) : 0;
    if (daysPending > APPROVAL_THRESHOLD_DAYS) {
      const existing = await prisma.escalation.findFirst({
        where: { userId: sheet.userId, ruleType: "manager_approval_overdue", status: { not: "resolved" } }
      });
      if (!existing) {
        await prisma.escalation.create({
          data: {
            userId: sheet.userId,
            goalSheetId: sheet.id,
            ruleType: "manager_approval_overdue",
            escalationLevel: 1,
            status: "open",
            daysPending
          }
        });
        created++;
      } else if (existing.escalationLevel < 3 && daysSince(existing.triggeredAt) >= LEVEL_ADVANCE_DAYS) {
        await prisma.escalation.update({
          where: { id: existing.id },
          data: { escalationLevel: existing.escalationLevel + 1, daysPending }
        });
        advanced++;
      }
    }
  }

  // Rule 3: Quarterly check-in not completed within the active window
  const quarters = ["q1", "q2", "q3", "q4"] as const;
  for (const quarter of quarters) {
    const qStart = cycle[`${quarter}Start`];
    const qEnd = cycle[`${quarter}End`];
    if (now < qStart || now > qEnd) continue;
    const daysIntoWindow = daysSince(qStart);
    if (daysIntoWindow <= 10) continue;

    const approvedSheets = await prisma.goalSheet.findMany({
      where: { cycleId: cycle.id, status: "approved_locked" },
      include: { goals: { include: { checkIns: { where: { quarter } } } } }
    });
    for (const sheet of approvedSheets) {
      const submitted = sheet.goals.some((g) => g.checkIns.some((ci) => ci.employeeSubmittedAt));
      if (!submitted) {
        const existing = await prisma.escalation.findFirst({
          where: { userId: sheet.userId, ruleType: "check_in_overdue", status: { not: "resolved" } }
        });
        if (!existing) {
          await prisma.escalation.create({
            data: {
              userId: sheet.userId,
              goalSheetId: sheet.id,
              ruleType: "check_in_overdue",
              escalationLevel: 1,
              status: "open",
              daysPending: daysIntoWindow
            }
          });
          created++;
        } else if (existing.escalationLevel < 3 && daysSince(existing.triggeredAt) >= LEVEL_ADVANCE_DAYS) {
          await prisma.escalation.update({
            where: { id: existing.id },
            data: { escalationLevel: existing.escalationLevel + 1, daysPending: daysIntoWindow }
          });
          advanced++;
        }
      }
    }
  }

  const total = await prisma.escalation.count();
  return { created, advanced, total };
}

export function escalationLevelLabel(level: number) {
  if (level === 1) return "Level 1: Employee";
  if (level === 2) return "Level 2: Manager";
  return "Level 3: Skip-level / HR";
}
