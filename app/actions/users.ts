"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { updateUserManagerForAdmin } from "@/lib/services/mutations";

export async function updateOrgHierarchy(formData: FormData) {
  const user = await requireRole(["admin"]);
  const targetUserId = String(formData.get("targetUserId") ?? "");
  const newManagerId = String(formData.get("newManagerId") ?? "") || null;

  await updateUserManagerForAdmin({
    adminId: user.id,
    targetUserId,
    newManagerId
  });

  revalidatePath("/dashboard/admin/org-hierarchy");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/manager");
}
