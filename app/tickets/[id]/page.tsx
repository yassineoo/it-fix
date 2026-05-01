import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import type { TicketWithTechnician } from "@/lib/types";
import { DeleteTicketButton } from "./DeleteTicketButton";
import { MarkResolvedButton } from "./MarkResolvedButton";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("*, technicians(id, full_name, speciality, email, phone)")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();
  const ticket = data as TicketWithTechnician & {
    technicians: {
      id: string;
      full_name: string;
      speciality: string;
      email: string | null;
      phone: string | null;
    } | null;
  };

  let screenshotUrl: string | null = null;
  if (ticket.screenshot_path) {
    const { data: signed } = await supabase.storage
      .from("bug-screenshots")
      .createSignedUrl(ticket.screenshot_path, 60 * 60);
    screenshotUrl = signed?.signedUrl ?? null;
  }

  const created = new Date(ticket.created_at).toLocaleString("fr-FR");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/tickets" className="text-sm text-brand-600 hover:underline">
          ← Retour aux tickets
        </Link>
      </div>

      <div className="card p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{ticket.title}</h1>
            <div className="text-sm text-slate-500">Créé le {created}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div className="prose prose-sm max-w-none mb-6 whitespace-pre-wrap text-slate-700">
          {ticket.description}
        </div>

        {ticket.technicians && (
          <div className="border-t border-slate-100 pt-4">
            <div className="text-xs font-medium text-slate-500 uppercase mb-2">
              Technicien assigné
            </div>
            <div className="font-semibold">{ticket.technicians.full_name}</div>
            <div className="text-sm text-slate-600">
              {ticket.technicians.speciality}
            </div>
            {ticket.technicians.email && (
              <div className="text-sm text-slate-600">
                📧 {ticket.technicians.email}
              </div>
            )}
          </div>
        )}
      </div>

      {screenshotUrl && (
        <div className="card p-6 mb-4">
          <div className="text-xs font-medium text-slate-500 uppercase mb-3">
            Capture d&apos;écran du bug
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshotUrl}
            alt="Capture du bug"
            className="rounded-lg border border-slate-200 max-h-[520px] w-auto"
          />
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <MarkResolvedButton ticketId={ticket.id} currentStatus={ticket.status} />
        <DeleteTicketButton ticketId={ticket.id} />
      </div>
    </div>
  );
}
