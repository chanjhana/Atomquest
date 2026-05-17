import { redirect } from "next/navigation";
import type { Role } from "@/lib/domain/enums";
import { getCurrentUser } from "./session";

export async function requireRole(allowed: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (!allowed.includes(user.role)) {
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}
