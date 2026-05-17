import { cookies } from "next/headers";
import type { Role } from "@/lib/domain/enums";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authRoleCookie } from "./constants";

export async function getCurrentSessionUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function getCurrentUser() {
  const sessionUser = await getCurrentSessionUser();
  if (!sessionUser?.email) return null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { supabaseAuthId: sessionUser.id },
        { email: sessionUser.email }
      ]
    }
  });

  return user;
}

export async function getCurrentRole(): Promise<Role | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

export function getRoleCookieValue() {
  const value = cookies().get(authRoleCookie)?.value as Role | undefined;
  if (value === "employee" || value === "manager" || value === "admin") return value;
  return null;
}
