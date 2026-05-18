"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { completeManagerReview, parseCheckInFormData, saveQuarterlyCheckIn } from "@/lib/services/mutations";

export async function saveCheckIn(formData: FormData) {
  const user = await requireRole(["employee"]);
  const entries = parseCheckInFormData(formData);
  const quarter = String(formData.get("quarter") ?? "q1") as "q1" | "q2" | "q3" | "q4";

  await saveQuarterlyCheckIn({ userId: user.id, quarter, entries, submit: false });

  revalidatePath("/dashboard/employee/check-ins");
  revalidatePath("/dashboard/manager/check-ins");
  redirect("/dashboard/employee/check-ins?success=Progress+saved");
}

export async function submitCheckIn(formData: FormData) {
  const user = await requireRole(["employee"]);
  const entries = parseCheckInFormData(formData);
  const quarter = String(formData.get("quarter") ?? "q1") as "q1" | "q2" | "q3" | "q4";

  await saveQuarterlyCheckIn({ userId: user.id, quarter, entries, submit: true });

  revalidatePath("/dashboard/employee/check-ins");
  revalidatePath("/dashboard/manager/check-ins");
  redirect(`/dashboard/employee/check-ins?success=${encodeURIComponent(`${quarter.toUpperCase()} check-in submitted`)}`);
}

export async function completeManagerCheckIn(formData: FormData) {
  const user = await requireRole(["manager"]);
  const employeeId = String(formData.get("employeeId") ?? "");
  const quarter = String(formData.get("quarter") ?? "q1") as "q1" | "q2" | "q3" | "q4";
  const managerComment = String(formData.get("managerComment") ?? "");

  await completeManagerReview({ managerId: user.id, employeeId, quarter, comment: managerComment });

  revalidatePath("/dashboard/manager/check-ins");
  revalidatePath(`/dashboard/manager/check-ins/${employeeId}`);
  revalidatePath("/dashboard/admin/completion");
  redirect("/dashboard/manager/check-ins?success=Review+completed");
}
