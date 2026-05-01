import { createClient } from "@/lib/supabase/server";
import { TicketForm } from "@/components/TicketForm";

export const dynamic = "force-dynamic";

export default async function NewTicketPage({
  searchParams
}: {
  searchParams: { technician?: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("technicians")
    .select("id, full_name, speciality, available")
    .order("available", { ascending: false })
    .order("full_name");

  const technicians = data ?? [];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ouvrir un ticket</h1>
        <p className="text-slate-600 text-sm">
          Décrivez la panne, choisissez un technicien, joignez la capture d&apos;écran.
        </p>
      </div>

      <div className="card p-6">
        <TicketForm
          technicians={technicians}
          defaultTechnicianId={searchParams.technician}
        />
      </div>
    </div>
  );
}
