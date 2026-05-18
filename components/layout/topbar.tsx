import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/domain/types";
import { LogOut, UserCircle2 } from "lucide-react";

export function Topbar({ user }: { user: User }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <UserCircle2 className="h-8 w-8 text-slate-300" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </div>
      <form action={logout}>
        <Button variant="ghost" type="submit" className="gap-2 text-slate-500 hover:text-slate-900">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </form>
    </header>
  );
}
