"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { resolveEscalationForAdmin } from "@/lib/services/mutations";

export async function resolveEscalation(formData: FormData) {
  const user = await requireRole(["admin"]);
  const escalationId = String(formData.get("escalationId") ?? "");

  await resolveEscalationForAdmin({ adminId: user.id, escalationId });

  revalidatePath("/dashboard/admin/escalations");
  revalidatePath("/dashboard/admin");
}
