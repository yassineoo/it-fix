"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { TicketStatus, TicketPriority } from "@/lib/types";

const STATUSES: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "open", label: "Ouverts" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved", label: "Résolus" },
  { value: "cancelled", label: "Annulés" }
];

const PRIORITIES: { value: TicketPriority | "all"; label: string }[] = [
  { value: "all", label: "Toutes priorités" },
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" }
];

export function TicketFilters() {
  const pathname = usePathname();
  const params = useSearchParams();
  const currentStatus = params.get("status") || "all";
  const currentPriority = params.get("priority") || "all";

  function hrefFor(key: "status" | "priority", value: string) {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={hrefFor("status", s.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              currentStatus === s.value
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-slate-700 border-slate-200 hover:border-brand-500"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>
      <span className="text-slate-300">·</span>
      <select
        aria-label="Filtrer par priorité"
        className="input w-auto py-1 text-xs"
        value={currentPriority}
        onChange={(e) => {
          window.location.href = hrefFor("priority", e.target.value);
        }}
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
