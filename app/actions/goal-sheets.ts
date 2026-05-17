"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import {
  approveGoalSheetForManager,
  parseGoalsFormData,
  returnGoalSheetForManager,
  saveGoalSheetForEmployee,
  withdrawGoalSheetForEmployee
} from "@/lib/services/mutations";

export async function saveGoalSheetDraft(formData: FormData) {
  const user = await requireRole(["employee"]);
  const goals = parseGoalsFormData(formData);
  const sheetId = String(formData.get("sheetId") ?? "") || null;

  await saveGoalSheetForEmployee({
    userId: user.id,
    managerId: user.managerId ?? null,
    sheetId,
    goals,
    submit: false
  });

  revalidatePath("/dashboard/employee");
  revalidatePath("/dashboard/employee/goals/new");
  const editPath = sheetId ? `/dashboard/employee/goals/${sheetId}/edit` : "/dashboard/employee/goals/new";
  redirect(`${editPath}?success=Draft+saved`);
}

export async function submitGoalSheet(formData: FormData) {
  const user = await requireRole(["employee"]);
  const goals = parseGoalsFormData(formData);
  const sheetId = String(formData.get("sheetId") ?? "") || null;
  const returnPath = sheetId
    ? `/dashboard/employee/goals/${sheetId}/edit`
    : "/dashboard/employee/goals/new";

  try {
    await saveGoalSheetForEmployee({
      userId: user.id,
      managerId: user.managerId ?? null,
      sheetId,
      goals,
      submit: true
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed. Please try again.";
    redirect(`${returnPath}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/dashboard/employee");
  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/manager/approvals");
  redirect(`/dashboard/employee?success=Goals+submitted+for+approval`);
}

export async function withdrawGoalSheet(formData: FormData) {
  const user = await requireRole(["employee"]);
  const sheetId = String(formData.get("sheetId") ?? "");
  await withdrawGoalSheetForEmployee({
    userId: user.id,
    sheetId
  });

  revalidatePath("/dashboard/employee");
  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/manager/approvals");
  redirect(`/dashboard/employee?success=Submission+withdrawn`);
}

export async function approveGoalSheet(formData: FormData) {
  const user = await requireRole(["manager"]);
  const sheetId = String(formData.get("sheetId") ?? "");
  const goals = parseGoalsFormData(formData);

  await approveGoalSheetForManager({
    managerId: user.id,
    sheetId,
    goals
  });

  revalidatePath("/dashboard/manager/approvals");
  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/employee");
  redirect(`/dashboard/manager/approvals?success=Goals+approved+successfully`);
}

export async function returnGoalSheet(formData: FormData) {
  const user = await requireRole(["manager"]);
  const sheetId = String(formData.get("sheetId") ?? "");
  const comment = String(formData.get("returnComment") ?? "");

  await returnGoalSheetForManager({
    managerId: user.id,
    sheetId,
    comment
  });

  revalidatePath("/dashboard/manager/approvals");
  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/employee");
  redirect(`/dashboard/manager/approvals?success=Goals+returned+for+revision`);
}
