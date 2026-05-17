import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth/session";

export default async function HomePage() {
  const role = await getCurrentRole();
  redirect(role ? `/dashboard/${role}` : "/login");
}
