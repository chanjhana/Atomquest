import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/domain/types";
import { LogOut } from "lucide-react";

export function Topbar({ user }: { user: User }) {
  return (
    <header className="flex items-center justify-between border-b-2 border-black bg-white px-8 py-4">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-black">{user.name}</p>
        <p className="text-xs uppercase tracking-wider text-black/55">{user.email}</p>
      </div>
      <form action={logout}>
        <Button variant="ghost" type="submit" className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </form>
    </header>
  );
}
