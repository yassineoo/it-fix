import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TicketCard } from "@/components/TicketCard";
import { TicketFilters } from "@/components/TicketFilters";
import type {
  TicketPriority,
  TicketStatus,
  TicketWithTechnician
} from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_VALUES: TicketStatus[] = [
  "open", "in_progress", "resolved", "cancelled"
];
const PRIORITY_VALUES: TicketPriority[] = ["low", "medium", "high", "urgent"];

export default async function TicketsPage({
  searchParams
}: {
  searchParams: { status?: string; priority?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("tickets")
    .select("*, technicians(id, full_name, speciality)")
    .order("created_at", { ascending: false });

  if (
    searchParams.status &&
    STATUS_VALUES.includes(searchParams.status as TicketStatus)
  ) {
    query = query.eq("status", searchParams.status);
  }
  if (
    searchParams.priority &&
    PRIORITY_VALUES.includes(searchParams.priority as TicketPriority)
  ) {
    query = query.eq("priority", searchParams.priority);
  }

  const { data } = await query;
  const tickets = (data ?? []) as TicketWithTechnician[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes tickets</h1>
          <p className="text-slate-600 text-sm">
            Tickets visibles : uniquement les vôtres (RLS activé).
          </p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary">
          + Nouveau ticket
        </Link>
      </div>

      <TicketFilters />

      {tickets.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          <p className="mb-3">Aucun ticket ne correspond à ces filtres.</p>
          <Link href="/tickets/new" className="btn btn-primary">
            Ouvrir un ticket
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
