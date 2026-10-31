import { redirect } from "next/navigation";
import { currentUser, finanteConfigured } from "@/lib/finante/auth";
import { LoginForm } from "@/components/finante/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">Imperial</p>
        <h1 className="mt-1 text-2xl font-bold">Finanțe</h1>
        {finanteConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-sm text-white/60">Panoul nu e configurat încă (lipsesc variabilele FINANTE_* în Railway).</p>
        )}
      </div>
    </main>
  );
}
