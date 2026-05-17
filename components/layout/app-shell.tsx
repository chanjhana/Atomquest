import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { User } from "@/lib/domain/types";

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
