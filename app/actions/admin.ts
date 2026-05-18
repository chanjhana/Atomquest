"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { saveCycleForAdmin, unlockGoalSheetForAdmin } from "@/lib/services/mutations";
import { cycleSchema } from "@/lib/validation/cycle";

export async function unlockGoalSheet(formData: FormData) {
  const user = await requireRole(["admin"]);
  const sheetId = String(formData.get("sheetId") ?? "");
  const reason = String(formData.get("reason") ?? "");

  await unlockGoalSheetForAdmin({ adminId: user.id, sheetId, reason });

  revalidatePath("/dashboard/admin/audit-logs");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/employee");
}

export type CycleFormState = { success?: string; error?: string };

export async function activateCycle(
  _prevState: CycleFormState,
  formData: FormData
): Promise<CycleFormState> {
  const user = await requireRole(["admin"]);
  const cycleId = String(formData.get("cycleId") ?? "") || null;

  const raw = {
    name: String(formData.get("name") ?? ""),
    goalSettingStart: String(formData.get("goalSettingStart") ?? ""),
    goalSettingEnd: String(formData.get("goalSettingEnd") ?? ""),
    q1Start: String(formData.get("q1Start") ?? ""),
    q1End: String(formData.get("q1End") ?? ""),
    q2Start: String(formData.get("q2Start") ?? ""),
    q2End: String(formData.get("q2End") ?? ""),
    q3Start: String(formData.get("q3Start") ?? ""),
    q3End: String(formData.get("q3End") ?? ""),
    q4Start: String(formData.get("q4Start") ?? ""),
    q4End: String(formData.get("q4End") ?? ""),
  };

  const validation = cycleSchema.safeParse(raw);
  if (!validation.success) {
    return { error: "Invalid cycle data. Check all date fields are filled." };
  }

  try {
    await saveCycleForAdmin({
      adminId: user.id,
      cycleId,
      name: raw.name,
      goalSettingStart: new Date(raw.goalSettingStart),
      goalSettingEnd: new Date(raw.goalSettingEnd),
      q1Start: new Date(raw.q1Start),
      q1End: new Date(raw.q1End),
      q2Start: new Date(raw.q2Start),
      q2End: new Date(raw.q2End),
      q3Start: new Date(raw.q3Start),
      q3End: new Date(raw.q3End),
      q4Start: new Date(raw.q4Start),
      q4End: new Date(raw.q4End),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to activate cycle." };
  }

  revalidatePath("/dashboard/admin/cycles");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/employee");
  revalidatePath("/dashboard/manager");

  return { success: "Cycle activated successfully." };
}
