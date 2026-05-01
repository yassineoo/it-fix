import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-7 w-7 rounded-lg bg-brand-600 text-white grid place-items-center text-xs">
            IT
          </span>
          <span>IT-Fix</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-600">
                Dashboard
              </Link>
              <Link href="/technicians" className="hover:text-brand-600">
                Techniciens
              </Link>
              <Link href="/tickets" className="hover:text-brand-600">
                Mes tickets
              </Link>
              <Link href="/tickets/new" className="btn btn-primary">
                Nouveau ticket
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-600">
                Connexion
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
