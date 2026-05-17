import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/domain/types";

export function Topbar({ user }: { user: User }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-8 py-4 backdrop-blur">
      <div>
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-semibold text-slate-950">{user.name}</p>
      </div>
      <form action={logout}>
        <Button variant="secondary" type="submit">Sign Out</Button>
      </form>
    </header>
  );
}
