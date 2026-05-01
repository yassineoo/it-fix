import type { Technician } from "@/lib/types";
import Link from "next/link";

export function TechnicianCard({ technician }: { technician: Technician }) {
  const initials = technician.full_name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{technician.full_name}</div>
          <div className="text-xs text-slate-500">{technician.speciality}</div>
        </div>
      </div>

      <div className="text-sm text-slate-600 space-y-1">
        {technician.email && <div>📧 {technician.email}</div>}
        {technician.phone && <div>📞 {technician.phone}</div>}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <span
          className={`badge ${
            technician.available ? "badge-resolved" : "badge-cancelled"
          }`}
        >
          {technician.available ? "Disponible" : "Occupé"}
        </span>
        <Link
          href={`/tickets/new?technician=${technician.id}`}
          className="text-sm text-brand-600 font-medium hover:underline"
        >
          Ouvrir un ticket →
        </Link>
      </div>
    </div>
  );
}
