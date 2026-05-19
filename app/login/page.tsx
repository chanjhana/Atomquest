import { loginAsRole, loginWithPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roles = [
  { role: "employee", label: "Login as Employee", email: "employee@demo.com" },
  { role: "manager", label: "Login as Manager", email: "manager@demo.com" },
  { role: "admin", label: "Login as Admin", email: "admin@demo.com" },
];

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="flex min-h-screen">
      {/* Left — black panel */}
      <section className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-black p-12 md:flex swiss-grid">
        <div className="relative z-10">
          <p className="text-3xl font-black uppercase tracking-[0.3em] text-[#FF3000]">Tracko</p>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black uppercase leading-none tracking-tighter text-white lg:text-7xl">
            Performance<br />Management<br />That<br />Closes<br />the Loop.
          </h1>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/55">
            Goal setting · Approvals · Check-ins · Escalations · Analytics
          </p>
        </div>
      </section>

      {/* Right — white panel */}
      <section className="flex flex-1 flex-col justify-center px-10 py-12 md:px-16 swiss-dots">
        {/* Mobile brand */}
        <p className="mb-10 text-sm font-black uppercase tracking-[0.5em] text-[#FF3000] md:hidden">
          Tracko
        </p>

        <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Sign In</h2>
        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-black/60">
          Use a demo account to explore each role — no setup needed.
        </p>

        {searchParams?.error ? (
          <div className="mt-6 border-l-4 border-[#FF3000] bg-[#F2F2F2] px-4 py-3">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF3000]">
              {searchParams.error}
            </p>
          </div>
        ) : null}

        <form action={loginWithPassword} className="mt-8 space-y-0">
          <Input name="email" type="email" placeholder="Email address" required className="border-b-0" />
          <Input name="password" type="password" placeholder="Password" required />
          <Button className="mt-4 w-full py-3.5 text-sm" type="submit">
            Sign In
          </Button>
        </form>

        <div className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-black/55">
            Demo Quick Access
          </p>
          <div className="mt-3 border-t-2 border-black">
            {roles.map((item) => (
              <form action={loginAsRole} key={item.role} className="border-b-2 border-black">
                <input type="hidden" name="email" value={item.email} />
                <Button
                  className="h-14 w-full justify-between px-4 text-sm hover:bg-black hover:text-white"
                  variant="ghost"
                  type="submit"
                >
                  <span className="font-black">{item.label}</span>
                  <span className="text-xs font-normal text-black/50">{item.email}</span>
                </Button>
              </form>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
