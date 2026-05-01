import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TicketCard } from "@/components/TicketCard";
import type { TicketWithTechnician } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: employee } = await supabase
    .from("employees")
    .select("full_name, department")
    .eq("id", user!.id)
    .single();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*, technicians(id, full_name, speciality)")
    .order("created_at", { ascending: false })
    .limit(5);

  const tickets = (ticketsData ?? []) as TicketWithTechnician[];

  const { count: openCount } = await supabase
    .from("tickets").select("*", { count: "exact", head: true })
    .eq("status", "open");
  const { count: progressCount } = await supabase
    .from("tickets").select("*", { count: "exact", head: true })
    .eq("status", "in_progress");
  const { count: resolvedCount } = await supabase
    .from("tickets").select("*", { count: "exact", head: true })
    .eq("status", "resolved");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Bonjour {employee?.full_name || "collègue"} 👋
        </h1>
        <p className="text-slate-600 text-sm">
          {employee?.department
            ? `Département ${employee.department}`
            : "Bienvenue sur votre espace IT-Fix."}
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Tickets ouverts" value={openCount ?? 0} tone="open" />
        <Stat label="En cours" value={progressCount ?? 0} tone="in_progress" />
        <Stat label="Résolus" value={resolvedCount ?? 0} tone="resolved" />
        <Link
          href="/tickets/new"
          className="card p-5 grid place-items-center text-center hover:border-brand-500 transition"
        >
          <span className="text-sm font-medium text-brand-600">
            + Nouveau ticket
          </span>
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Tickets récents</h2>
          <Link
            href="/tickets"
            className="text-sm text-brand-600 font-medium hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="card p-8 text-center text-slate-600">
            <p className="mb-3">Aucun ticket pour l&apos;instant.</p>
            <Link href="/tickets/new" className="btn btn-primary">
              Ouvrir votre premier ticket
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label, value, tone
}: {
  label: string;
  value: number;
  tone: "open" | "in_progress" | "resolved";
}) {
  return (
    <div className="card p-5">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1">
        <span className={`badge badge-${tone}`}>{label}</span>
      </div>
    </div>
  );
}
