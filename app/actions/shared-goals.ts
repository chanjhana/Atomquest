"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { pushSharedGoalForManager } from "@/lib/services/mutations";

export async function pushSharedGoal(formData: FormData) {
  const user = await requireRole(["manager", "admin"]);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const thrustArea = String(formData.get("thrustArea") ?? "").trim();
  const uomType = String(formData.get("uomType") ?? "numeric") as "numeric" | "percentage" | "timeline" | "zero";
  const scoreDirectionRaw = String(formData.get("scoreDirection") ?? "");
  const scoreDirection =
    scoreDirectionRaw === "higher_is_better" || scoreDirectionRaw === "lower_is_better" ? scoreDirectionRaw : null;
  const target = String(formData.get("target") ?? "").trim();
  const primaryOwnerUserId = String(formData.get("primaryOwnerUserId") ?? "");
  const recipientUserIds = formData.getAll("recipientUserIds").map(String).filter(Boolean);

  await pushSharedGoalForManager({
    createdByUserId: user.id,
    primaryOwnerUserId,
    recipientUserIds,
    title,
    description,
    thrustArea,
    uomType,
    scoreDirection,
    target
  });

  revalidatePath("/dashboard/manager/shared-goals");
  revalidatePath("/dashboard/admin/shared-goals");
  revalidatePath("/dashboard/employee");
}
