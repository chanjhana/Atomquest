import { loginAsRole, loginWithPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const roles = [
  { role: "employee", label: "Login as Employee", email: "employee@demo.com" },
  { role: "manager", label: "Login as Manager", email: "manager@demo.com" },
  { role: "admin", label: "Login as Admin", email: "admin@demo.com" }
];

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-4xl overflow-hidden p-0">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <section className="bg-slate-950 p-10 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-300">Tracko</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Performance management that actually closes the loop.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Goal setting, manager approvals, quarterly check-ins, and escalations — unified into one seamless workflow.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Employees set and submit goals</li>
              <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Managers review, approve, or return</li>
              <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Quarterly check-ins with live scoring</li>
              <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Auto-escalation for overdue actions</li>
            </ul>
          </section>
          <section className="p-10">
            <h2 className="text-2xl font-semibold text-slate-950">Sign In</h2>
            <p className="mt-2 text-sm text-slate-500">Use a demo account below to explore each role — no setup needed.</p>
            {searchParams?.error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</p>
            ) : null}
            <form action={loginWithPassword} className="mt-8 space-y-4">
              <Input name="email" type="email" placeholder="employee@demo.com" required />
              <Input name="password" type="password" placeholder="Password" required />
              <Button className="w-full" type="submit">Sign In</Button>
            </form>
            <div className="mt-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Demo Quick Access</p>
              {roles.map((item) => (
                <form action={loginAsRole} key={item.role}>
                  <input type="hidden" name="email" value={item.email} />
                  <Button className="w-full justify-between" type="submit">
                    <span>{item.label}</span>
                    <span className="text-xs font-normal opacity-80">{item.email}</span>
                  </Button>
                </form>
              ))}
            </div>
          </section>
        </div>
      </Card>
    </main>
  );
}
