"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authRoleCookie, defaultDemoPassword } from "@/lib/auth/constants";

async function persistRoleCookie(email: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error(`No application user found for ${email}. Run the Prisma seed after wiring Supabase.`);
  }

  cookies().set(authRoleCookie, user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return user.role;
}

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const role = await persistRoleCookie(email);
  redirect(`/dashboard/${role}`);
}

export async function loginAsRole(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: defaultDemoPassword
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const role = await persistRoleCookie(email);
  redirect(`/dashboard/${role}`);
}

export async function logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  cookies().delete(authRoleCookie);
  redirect("/login");
}
