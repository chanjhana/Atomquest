import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { defaultDemoPassword } from "@/lib/auth/constants";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function upsertAuthUser(email: string, role: "employee" | "manager" | "admin", name: string) {
  try {
    const admin = createSupabaseAdminClient();
    const existing = await admin.auth.admin.listUsers();
    const match = existing.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (match) {
      const updated = await admin.auth.admin.updateUserById(match.id, {
        password: defaultDemoPassword,
        email_confirm: true,
        user_metadata: { role, name }
      });
      if (updated.error) throw updated.error;
      return match.id;
    }

    const created = await admin.auth.admin.createUser({
      email,
      password: defaultDemoPassword,
      email_confirm: true,
      user_metadata: { role, name }
    });
    if (created.error) throw created.error;
    return created.data.user.id;
  } catch (error) {
    console.warn(`Skipping Supabase Auth user sync for ${email}:`, error);
    return null;
  }
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.escalation.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.sharedGoalLink.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.sharedGoalGroup.deleteMany();
  await prisma.goalSheet.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.user.deleteMany();

  const adminAuthId = await upsertAuthUser("admin@demo.com", "admin", "Ravi Patel");
  const managerAuthId = await upsertAuthUser("manager@demo.com", "manager", "Priya Sharma");
  const employeeAuthId = await upsertAuthUser("employee@demo.com", "employee", "Arun Kumar");
  const teammateAuthId = await upsertAuthUser("meena@demo.com", "employee", "Meena Iyer");
  const kiranAuthId = await upsertAuthUser("kiran@demo.com", "employee", "Kiran S.");

  const admin = await prisma.user.create({
    data: {
      name: "Ravi Patel",
      email: "admin@demo.com",
      role: "admin",
      supabaseAuthId: adminAuthId,
      department: "HR",
      designation: "HR Admin"
    }
  });

  const manager = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "manager@demo.com",
      role: "manager",
      supabaseAuthId: managerAuthId,
      managerId: admin.id,
      department: "Engineering",
      designation: "Engineering Manager"
    }
  });

  const employee = await prisma.user.create({
    data: {
      name: "Arun Kumar",
      email: "employee@demo.com",
      role: "employee",
      supabaseAuthId: employeeAuthId,
      managerId: manager.id,
      department: "Engineering",
      designation: "Product Engineer"
    }
  });

  const teammate = await prisma.user.create({
    data: {
      name: "Meena Iyer",
      email: "meena@demo.com",
      role: "employee",
      supabaseAuthId: teammateAuthId,
      managerId: manager.id,
      department: "Engineering",
      designation: "QA Engineer"
    }
  });

  const kiran = await prisma.user.create({
    data: {
      name: "Kiran S.",
      email: "kiran@demo.com",
      role: "employee",
      supabaseAuthId: kiranAuthId,
      managerId: manager.id,
      department: "Engineering",
      designation: "Data Analyst"
    }
  });

  const cycle = await prisma.cycle.create({
    data: {
      name: "FY 2026-27",
      isActive: true,
      goalSettingStart: new Date("2026-05-01"),
      goalSettingEnd: new Date("2026-05-31"),
      q1Start: new Date("2026-05-15"),
      q1End: new Date("2026-06-15"),
      q2Start: new Date("2026-10-01"),
      q2End: new Date("2026-10-31"),
      q3Start: new Date("2027-01-01"),
      q3End: new Date("2027-01-31"),
      q4Start: new Date("2027-03-01"),
      q4End: new Date("2027-04-30")
    }
  });

  // Arun Kumar — draft sheet with goals ready to submit (employee demo)
  const arunSheet = await prisma.goalSheet.create({
    data: {
      userId: employee.id,
      managerId: manager.id,
      cycleId: cycle.id,
      status: "draft"
    }
  });

  const arunGoal1 = await prisma.goal.create({
    data: {
      goalSheetId: arunSheet.id,
      title: "Improve platform reliability",
      description: "Reduce production incidents through proactive monitoring and fixes.",
      thrustArea: "Operational Excellence",
      uomType: "numeric",
      scoreDirection: "lower_is_better",
      target: "5 incidents",
      weightage: 40,
      sortOrder: 1
    }
  });

  const arunGoal2 = await prisma.goal.create({
    data: {
      goalSheetId: arunSheet.id,
      title: "Increase automation coverage",
      description: "Automate regression coverage for critical modules.",
      thrustArea: "Engineering Productivity",
      uomType: "percentage",
      scoreDirection: "higher_is_better",
      target: "80%",
      weightage: 60,
      sortOrder: 2
    }
  });

  // Meena Iyer — pending_approval sheet with goals (manager approval demo)
  const meenaSheet = await prisma.goalSheet.create({
    data: {
      userId: teammate.id,
      managerId: manager.id,
      cycleId: cycle.id,
      status: "pending_approval",
      submittedAt: new Date("2026-05-14")
    }
  });

  await prisma.goal.createMany({
    data: [
      {
        goalSheetId: meenaSheet.id,
        title: "Zero critical bug escapes to production",
        description: "Prevent critical bugs from reaching production through rigorous QA gates.",
        thrustArea: "Quality Assurance",
        uomType: "numeric",
        scoreDirection: "lower_is_better",
        target: "0 bugs",
        weightage: 50,
        sortOrder: 1
      },
      {
        goalSheetId: meenaSheet.id,
        title: "Achieve 90% test automation coverage",
        description: "Expand automated test suite across all critical paths.",
        thrustArea: "Engineering Productivity",
        uomType: "percentage",
        scoreDirection: "higher_is_better",
        target: "90%",
        weightage: 50,
        sortOrder: 2
      }
    ]
  });

  // Kiran S. — draft sheet, no goals (overdue for submission)
  const kiranSheet = await prisma.goalSheet.create({
    data: {
      userId: kiran.id,
      managerId: manager.id,
      cycleId: cycle.id,
      status: "draft"
    }
  });

  // Escalations for admin demo
  await prisma.escalation.create({
    data: {
      userId: kiran.id,
      goalSheetId: kiranSheet.id,
      ruleType: "goal_submission_overdue",
      escalationLevel: 1,
      status: "open",
      daysPending: 14,
      triggeredAt: new Date("2026-05-14")
    }
  });

  await prisma.escalation.create({
    data: {
      userId: teammate.id,
      goalSheetId: meenaSheet.id,
      ruleType: "manager_approval_overdue",
      escalationLevel: 2,
      status: "acknowledged",
      daysPending: 8,
      triggeredAt: new Date("2026-05-18")
    }
  });

  // Audit log trail for admin demo
  await prisma.auditLog.create({
    data: {
      userId: teammate.id,
      goalSheetId: meenaSheet.id,
      action: "submit",
      target: "Goal Sheet",
      newValue: "pending_approval"
    }
  });

  console.log("Seeded AtomQuest application data and Supabase auth users.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
