"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center gap-1.5 rounded-full border border-bg-border px-3 py-1.5 text-xs text-text-muted transition hover:border-red-500/50 hover:text-red-300"
    >
      <LogOut className="h-3.5 w-3.5" />
      Logout
    </button>
  );
}
