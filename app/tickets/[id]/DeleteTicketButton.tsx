"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeleteTicketButton({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce ticket ? Cette action est irréversible.")) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("tickets").delete().eq("id", ticketId);
    setLoading(false);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    router.push("/tickets");
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="btn btn-danger">
      {loading ? "Suppression..." : "Supprimer le ticket"}
    </button>
  );
}
