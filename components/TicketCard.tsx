import Link from "next/link";
import type { TicketWithTechnician } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./StatusBadge";

export function TicketCard({ ticket }: { ticket: TicketWithTechnician }) {
  const date = new Date(ticket.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="card p-5 block hover:border-brand-500 transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 line-clamp-1">
          {ticket.title}
        </h3>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
        {ticket.description}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <PriorityBadge priority={ticket.priority} />
        {ticket.technicians && (
          <span>
            👨‍🔧 {ticket.technicians.full_name} · {ticket.technicians.speciality}
          </span>
        )}
        <span className="ml-auto">{date}</span>
      </div>
    </Link>
  );
}
