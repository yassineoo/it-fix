"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TicketStatus } from "@/lib/types";

type Props = { ticketId: string; currentStatus: TicketStatus };

const NEXT_STATUS: Record<TicketStatus, { to: TicketStatus; label: string } | null> = {
  open: { to: "in_progress", label: "Passer en cours" },
  in_progress: { to: "resolved", label: "Marquer comme résolu" },
  resolved: null,
  cancelled: null
};

export function MarkResolvedButton({ ticketId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const action = NEXT_STATUS[currentStatus];
  if (!action) return null;

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    const patch: { status: TicketStatus; resolved_at?: string } = {
      status: action!.to
    };
    if (action!.to === "resolved") patch.resolved_at = new Date().toISOString();
    const { error } = await supabase
      .from("tickets")
      .update(patch)
      .eq("id", ticketId);
    setLoading(false);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button onClick={handleClick} disabled={loading} className="btn btn-primary">
      {loading ? "..." : action.label}
    </button>
  );
}
